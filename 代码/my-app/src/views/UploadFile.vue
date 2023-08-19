<template>
  <div>
    <el-row>
      <el-col :span="12">
        <!-- 单/多文件上传 -->
        <el-card>
          <span>小文件上传——支持多文件上传</span>
          <el-divider></el-divider>
          <div class="btnfile">
            <input
              type="file"
              ref="smallUploader"
              @change="smallFileChange"
              multiple
            />
            <el-button @click="handleClickSmall" type="primary" size="mini"
              >选择文件</el-button
            >
          </div>

          <div class="file-list">
            <el-tag
              :disable-transitions="tagClose"
              v-for="item in smallFiles"
              :key="item.name"
              closable
              @close="deleteSmallFile(item)"
            >
              {{ item.name }}
            </el-tag>
          </div>
          <div class="btn">
            <el-button
              @click="submitSmall"
              type="primary"
              size="mini"
              ref="btnSmall"
              >上传</el-button
            >
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 大文件上传 -->
        <el-card shadow="hover">
          <span>大文件上传——支持断点续传</span>
          <el-divider></el-divider>
          <div class="btnfile">
            <input type="file" ref="uploader" @change="fileChange" />
            <el-button @click="handleClick" type="primary" size="mini"
              >选择文件</el-button
            >
          </div>
          <div class="file-list">
            <el-tag
              closable
              v-if="file.name"
              @close="deleteFile"
              :disable-transitions="tagClose"
            >
              {{ file.name }}
            </el-tag>
          </div>
          <div v-if="percentage !== 0">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="percentage"
              class="progress"
            ></el-progress>
            <p class="text">{{ text }}</p>
          </div>

          <div class="btn">
            <el-button @click="submit" type="primary" size="mini"
              >上传</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { zrUtil } from "echarts";
export default {
  name: "UploadFile",
  data() {
    return {
      tagClose: true,
      percentage: 0,
      // 小文件
      smallFiles: [],
      smallUploader: [],
      file: [], // 大文件
      text: "",
    };
  },
  methods: {
    // 点击上传文件按钮
    handleClickSmall() {
      this.$refs.smallUploader.click();
    },
    // 选择小文件
    smallFileChange(e) {
      if (e.target.files.length > 1) {
        this.smallFiles = this.smallFiles.concat(
          Object.values(e.target.files).slice(0, e.target.files.length)
        );
        return;
      }
      if (e.target.files.length === 1) {
        this.smallFiles.push(e.target.files[0]);
      } else {
        return;
      }
    },
    // 上传小文件
    async submitSmall() {
      if (this.smallFiles.length === 0)
        return this.$message.error("请选择文件");

      this.smallFiles.forEach((item) => {
        const _formData = new FormData();
        _formData.append(item.name + "file", item);
        this.$axios.post("/api/smallUploader", _formData);
      });

      // 清空文件
      this.smallFiles = [];
      this.$message.success("文件上传成功!");
    },
    // 删除上传的大文件
    deleteFile() {
      this.file = [];
    },
    // 删除某个上传的文件
    deleteSmallFile(item) {
      const deletename = item.name;
      const newArr = [];
      for (let i = 0; i < this.smallFiles.length; i++) {
        if (this.smallFiles[i].name !== deletename) {
          newArr.push(this.smallFiles[i]);
        }
      }
      this.smallFiles = newArr;
    },
    // 点击选择文件按钮——大文件
    handleClick() {
      this.$refs.uploader.click();
    },
    // 用户上传大文件,
    async submit() {
      const file = this.file;
      if (file.length === 0 && this.percentage === 0)
        return this.$message.error("请选择文件");
      if (!file) {
        if (this.percentage === 100) {
          this.text = "";
          this.percentage = 0;
        }
        return;
      }
      // 清空删除文件的tag
      this.file = [];
      // 文件转换为二进制文件,生成hash作为文件唯一标识
      const content = await this.read(file);
      const hash = CryptoJS.MD5(content);

      const { size, name, type } = file;
      const chunkSize = 64 * 1024; // 每次上传的分片文件大小
      let uploaded = 0; // 上传进度:已经上传的文件大小
      // 每次在本地存储中读取当前的上传进度；这样可以进行断点传续
      if (localStorage.getItem(hash)) {
        uploaded = Number(localStorage.getItem(hash));
      }
      this.text = name + " 文件上传中...";
      const breakpoint = 2000 * 1024; // 1MB
      while (uploaded < size) {
        // 每次要上传的分片文件
        const chunk = file.slice(uploaded, uploaded + chunkSize, type);
        const _formData = new FormData();
        _formData.append("hash", hash);
        _formData.append("name", name);
        _formData.append("type", type);
        _formData.append("size", size);
        _formData.append("offset", uploaded);
        _formData.append("file", chunk);

        try {
          await this.$axios.post("/api/upload", _formData);
        } catch (e) {
          this.text = name + " 文件上传失败!" + e.message;
          return;
        }

        // 更改上传进度
        uploaded += chunk.size;
        // 保存当前上传进度,可以断点续传
        localStorage.setItem(hash, uploaded);
        this.percentage = parseInt(100 * (uploaded / size));
        // 断点续传测试
        // if (uploaded > breakpoint) {
        //   return;
        // }
      }
      this.text = name + " 文件上传成功";
      // 清除上传成功的文件的进度
      localStorage.removeItem(hash);
    },
    // 用户选择大文件
    async fileChange(e) {
      if (this.percentage === 0) {
        this.file = e.target.files[0];
        return;
      }
      if (this.percentage === 100) {
        this.percentage = 0;
        this.file = e.target.files[0]; // 获得第一个文件
        return;
      }
      if (this.percentage !== 0) {
        this.$message.warning("请等待当前文件上传成功!");
      }
    },
    // 读取文件为二进制字符串类型
    read(file) {
      const reader = new FileReader();
      // 读取file文件返回二进制文件
      reader.readAsBinaryString(file);
      return new Promise((resolve, reject) => {
        // 读取成功
        reader.onload = function () {
          resolve(reader.result);
        };
        // 读取失败
        reader.onerror = function () {
          reject(reader.result);
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.btnfile {
  width: 88px;
  overflow: hidden;
}
input[type="file"] {
  display: none;
  z-index: -999;
}
.el-card {
  margin: 50px;
  padding: 20px;

  .el-progress {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .el-button {
    margin-top: 10px;
  }
  .small-text,
  .text {
    font-size: 12px;
    color: #778899;
  }
  .small-text {
    margin-top: 20px;
  }
}

.el-tag {
  margin-top: 10px;
  margin-right: 5px;
}
</style>
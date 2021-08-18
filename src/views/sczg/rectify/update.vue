<template>
  <div class="app-container">
    <!--添加表单-->
    <el-form ref="ruleForm" :rules="ruleForm"
             :inline="false"
             :model="rectifyItem">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="inspectUnit">
            <el-select v-model="rectifyItem.inspectUnit" placeholder="选择检查单位">
              <el-option v-for="iunit in inspectUnitList"
                         :key="iunit" :label="iunit" :value="iunit"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="inspectPerson">
            <el-input v-model="rectifyItem.inspectPerson" placeholder="输入检查人"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="inspectDate">
            <el-date-picker v-model="rectifyItem.inspectDate" type="date"
                            placeholder="选择检查时间" style="width: 100%;"/>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="rectifyUnit">
            <el-select v-model="rectifyItem.rectifyUnit" placeholder="选择整改单位">
              <el-option v-for="runit in rectifyUnitList"
                         :key="runit" :label="runit" :value="runit"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="expiryDate">
            <el-date-picker v-model="rectifyItem.expiryDate"
                            type="date" placeholder="选择整改完成期限"
                            style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="rectifyContent">
            <el-input type="textarea" :autosize="{ minRows: 10}"
                      v-model="rectifyItem.rectifyContent"
                      placeholder="输入整改项目内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="problemPicture">
            <el-upload
              class="upload-class"
              :action="baseApi + '/file/upload'"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :show-file-list="false"
              name="file">
              <el-button size="small" type="primary">点击上传问题图片</el-button>
              <!--<div slot="tip" class="el-upload__tip">上传jpg/png文件，且不超过5M</div>-->
            </el-upload>
            <img :src="rectifyItem.problemPicture"
                 style="width: 350px;height: 300px" alt="问题图片"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" size="small" @click="updateRectifyItem('ruleForm')">修改</el-button>
            <el-button type="default" size="small" @click="Cancel()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import dept from '@/api/dept'
import rectify from "@/api/rectify";

export default {
  name: 'add',
  data() {
    return {
      baseApi: process.env.BASE_API,
      fileUploadBtnText: '点击上传', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用
      loading: false,
      inspectUnitList: [],
      rectifyUnitList: [],
      rectifyItem: {
        serialNumber: '',
        inspectUnit: '',
        inspectPerson: '',
        inspectDate: '',
        rectifyUnit: '',
        expiryDate: '',
        problemPicture: '',
        rectifyContent: '',
        upPerson: '',
      },
      ruleForm: {
        inspectUnit: [{required: true, message: '请选择检查单位', trigger: 'change'}],
        inspectPerson: [{required: true, message: '请输入检查人名称', trigger: 'blur'}],
        inspectDate: [{required: true, message: '请选择日期', trigger: 'change'}],
        rectifyUnit: [{required: true, message: '请选择整改单位', trigger: 'change'}],
        expiryDate: [{required: true, message: '请选择日期', trigger: 'change'}],
        // problemPicture: [{required: true, message: '请上传图片', trigger: 'blur'}],
        rectifyContent: [{required: true, message: '请输入整改内容', trigger: 'blur'}],
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.rectifyItem.serialNumber = this.$route.params.id
      this.getUnitInformation();
      this.getRectifyItem();
    }
  },
  methods: {
    getRectifyItem() {
      rectify.getRectifyItemById(this.rectifyItem.serialNumber).then(response => {
        this.rectifyItem = response.data.item;
      })
    },
    getUnitInformation() {
      dept.getUnitInfo().then(response => {
        this.rectifyUnitList = response.data.items;
        this.inspectUnitList = response.data.items;
      })
    },
    // 图片上传
    handleSuccess(response, file) {
      // 调用上传返回接口
      this.rectifyItem.problemPicture = response.data.url;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 批量导入
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    },
    //上传成功
    fileUploadSuccess(response) {
      this.fileUploadBtnText = '导入成功'
      //提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    //上传失败
    fileUploadError() {
      this.fileUploadBtnText = '导入失败'
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传失败'
      })
    },

    updateRectifyItem(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.rectifyItem.problemPicture === '' || this.rectifyItem.problemPicture == null) {
          this.$message.error("图片不能为空");
          return false
        }
        if (valid) {
          // console.log(this.rectifyItem)
          rectify.updateRectifyItemById(this.rectifyItem).then((response) => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.$router.push({
              path: '/rectify/list'
            })
          })
        } else {
          return false;
        }
      })
    },
    Cancel() {
      this.$router.push({
        path: '/rectify/list'
      })
    }
  }
}
</script>

<style scoped>
.upload-class {
  width: 250px;
}

.line {
  text-align: center;
}
</style>

<style rel="stylesheet/scss" lang="scss">

.el-row {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-form-item__error {
  color: #ff0000;
}

.el-textarea__inner {
  width: 380px;
}
</style>

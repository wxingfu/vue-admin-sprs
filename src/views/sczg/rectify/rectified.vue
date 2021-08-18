<template>
  <div class="app-container">
    <!--添加表单-->
    <el-form ref="ruleForm" :rules="ruleForm"
             :inline="false"
             :model="rectifiedItem">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="rectifyCompleteDate">
            <el-date-picker v-model="rectifiedItem.rectifyCompleteDate" type="date"
                            placeholder="选择整改完成日期" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="rectifyPerson">
            <el-input clearable v-model="rectifiedItem.rectifyPerson" placeholder="输入整改人名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">

        <el-col :span="10">
          <el-form-item prop="rectification">
            <el-input clearable type="textarea" :autosize="{ minRows: 8}"
                      v-model="rectifiedItem.rectification"
                      placeholder="输入整改情况"/>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="rectifyPicture">
            <el-upload
              class="upload-class"
              :action="baseApi + '/file/upload'"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :show-file-list="false"
              name="file">
              <el-button size="small" type="primary">点击上传完成图片</el-button>
            </el-upload>
            <img :src="rectifiedItem.rectifyPicture"
                 style="width: 350px;height: 300px" alt="完成图片"/>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" size="small" @click="addRectified('ruleForm')">添加</el-button>
            <el-button type="default" size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="default" size="small" @click="Cancel()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>

import rectify from "@/api/rectify";

export default {
  name: "rectified",
  data() {
    return {
      baseApi: process.env.BASE_API,
      rectifiedItem: {
        serialNumber:'',
        rectifyCompleteDate: '',
        rectifyPerson: '',
        rectification: '',
        rectifyPicture: ''
      },
      ruleForm: {
        rectifyCompleteDate: [{required: true, message: '请选择整改完成日期', trigger: 'change'}],
        rectifyPerson: [{required: true, message: '请输入整改人名称', trigger: 'blur'}],
        rectification: [{required: true, message: '请输入整改完成情况', trigger: 'blur'}],
      }
    }
  },
  created() {
    //获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.rectifiedItem.serialNumber = this.$route.params.id
      this.getRectified();
    }
  },
  methods: {
    getRectified(){
      rectify.getRectifyItemById(this.rectifiedItem.serialNumber).then(response=>{
        this.rectifiedItem = response.data.item;
      })
    },
    addRectified(formName) {
      this.$refs[formName].validate((valid) => {
        if(this.rectifiedItem.rectifyPicture === ''||this.rectifiedItem.rectifyPicture == null){
          this.$message.error("图片不能为空");
          return false
        }
        if (valid) {
          rectify.addRectifiedItem(this.rectifiedItem).then(response=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.$router.push({
              path: '/rectify/list'
            })
          })
        }else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 图片上传
    handleSuccess(response, file) {
      this.rectifiedItem.rectifyPicture = response.data.url;
    },
    beforeUpload(file) {

      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 jpg/png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
  width: 468px;
}
</style>


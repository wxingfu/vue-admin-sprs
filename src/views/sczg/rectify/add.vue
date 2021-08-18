<template>
  <div class="app-container">
    <!--添加表单-->
    <el-form ref="ruleForm" :rules="ruleForm"
             :inline="false"
             :model="rectifyItem">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="inspectUnit">
            <el-select clearable v-model="rectifyItem.inspectUnit" placeholder="选择检查单位">
              <el-option v-for="iunit in inspectUnitList"
                         :key="iunit" :label="iunit" :value="iunit"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="inspectPerson">
            <el-input clearable v-model="rectifyItem.inspectPerson" placeholder="输入检查人名称"></el-input>
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
            <el-select clearable v-model="rectifyItem.rectifyUnit" placeholder="选择整改单位">
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
            <el-input clearable type="textarea" :autosize="{ minRows: 10}"
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
                 style="width: 100%;height: 10%" alt="问题图片"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">

          <el-form-item>
            <el-button type="primary" size="small" @click="addRectifyItem('ruleForm')">添加</el-button>
            <el-button type="default" size="small" @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>

          <!--批量添加-->
          <el-form-item label="批量添加" style="margin-top: 30%">
            <el-tag>
              <i class="el-icon-download"/>
              <a :href="baseApi+'/file/download?filename=template.xls'">点击下载模版</a>
            </el-tag>
            <el-upload class="upload-class"
                       ref="upload"
                       :auto-upload="false"
                       :on-success="fileUploadSuccess"
                       :on-error="fileUploadError"
                       :before-upload="fileBeforeUpload"
                       :disabled="importBtnDisabled"
                       :limit="1"
                       :http-request="batchImport"
                       accept=".xlsx,application/vnd.ms-excel"
                       action="">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

              <el-button :loading="loading" style="margin-left: 10px;" size="small" type="success"
                         @click="submitUpload">{{ fileUploadBtnText }}
              </el-button>

            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import dept from '@/api/dept'
import rectify from "@/api/rectify";
import {getToken} from '@/utils/auth'
import {mapGetters} from "vuex";

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
        inspectDate: [{type: 'date', required: true, message: '请选择整检查日期', trigger: 'change'}],
        rectifyUnit: [{required: true, message: '请选择整改单位', trigger: 'change'}],
        expiryDate: [{type: 'date', required: true, message: '请选择整改完成期限', trigger: 'change'}],
        // problemPicture: [{required: true, message: '请上传图片', trigger: 'blur'}],
        rectifyContent: [{required: true, message: '请输入整改内容', trigger: 'blur'}],
      }
    }
  },
  created() {
    // this.rectifyItem.upPerson = getToken();
    this.rectifyItem.upPerson = this.name;
    // alert(this.roles)
    this.getUnitInformation();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    getUnitInformation() {
      dept.getUnitInfo().then(response => {
        this.rectifyUnitList = response.data.items;
        this.inspectUnitList = response.data.items;
      })
    },
    // 图片上传
    handleSuccess(response, file) {
      // 调用上传返回接口
      // alert(this.rectifyItem.problemPicture)
      this.rectifyItem.problemPicture = response.data.url;
      // alert(this.rectifyItem.problemPicture)
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
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    // 批量导入
    //点击按钮上传文件到接口里面
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
        message: '添加成功'
      })
    },
    fileBeforeUpload(file) {
      // 验证文件大小
      if (file.size / 1024 / 1024 > 10) {
        this.$message({
          message: `上传文件大小不能超过10M!`,
          type: 'warning'
        })
        return false
      }
    },
    //上传失败
    fileUploadError() {
      this.fileUploadBtnText = '导入失败'
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加失败'
      })
    },
    batchImport(param) {
      if (param.file == null) {
        return;
      }
      let formData = new FormData()
      formData.append('file', param.file)
      formData.append('up', this.name)
      rectify.excelImport(formData).then(response => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // location.reload();
        this.$router.push({
          path: '/rectify/list'
        })
      }).catch(action => {
        this.$message({
          type: 'error',
          message: '添加失败!'
        })
      })
    },

    addRectifyItem(formName) {
      // console.log(this.rectifyItem)
      this.$refs[formName].validate((valid) => {
        if (this.rectifyItem.problemPicture === '' || this.rectifyItem.problemPicture == null) {
          this.$message.error("图片不能为空");
          return false
        }
        if (valid) {
          // alert('submit!');
          rectify.addRectifyItem(this.rectifyItem).then((response) => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.$router.push({
              path: '/rectify/list'
            })
          })
        } else {
          // alert('error submit!!');
          return false;
        }

      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
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
  width: 100%;
}
</style>

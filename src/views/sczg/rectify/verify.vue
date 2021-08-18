<template>
  <div class="app-container">
    <!--添加表单-->
    <el-form ref="ruleForm" :rules="ruleForm"
             :inline="false"
             :model="verifyItem">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="verifyDate">
            <el-date-picker v-model="verifyItem.verifyDate" type="date"
                            placeholder="选择验证日期" style="width: 100%;"/>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="verifyUnit">
            <el-select clearable v-model="verifyItem.verifyUnit" placeholder="选择验证单位">
              <el-option v-for="vunit in verifyUnitList"
                         :key="vunit" :label="vunit" :value="vunit"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="verifyPerson">
            <el-input clearable v-model="verifyItem.verifyPerson"
                      placeholder="输入验证人名称"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item prop="verifyContent">
            <el-input clearable type="textarea" :autosize="{ minRows: 5}"
                      v-model="verifyItem.verifyContent"
                      placeholder="输入验证情况"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" size="small" @click="addVerified('ruleForm')">添加</el-button>
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
import dept from '@/api/dept'

export default {
  name: "verify",
  data() {
    return {
      verifyUnitList:[],
      verifyItem: {
        serialNumber:'',
        verifyDate: '',
        verifyPerson: '',
        verifyContent: '',
        verifyUnit:''
      },
      ruleForm: {
        verifyContent: [{required: true, message: '请输入验证情况', trigger: 'blur'}],
        verifyPerson: [{required: true, message: '请输入验证人名称', trigger: 'blur'}],
        verifyDate: [{required: true, message: '请选择验证日期', trigger: 'change'}],
        verifyUnit: [{required: true, message: '请选择验证单位', trigger: 'change'}],
      }
    }
  },
  created() {
    //获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.verifyItem.serialNumber = this.$route.params.id
      this.getDept();
      this.getVerified();
    }
  },
  methods:{
    getVerified(){
      rectify.getRectifyItemById(this.verifyItem.serialNumber).then(response=>{
        this.verifyItem = response.data.item;
      })
    },
    addVerified(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          rectify.addVerifiedItem(this.verifyItem).then(response=>{
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
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    Cancel() {
      this.$router.push({
        path: '/rectify/list'
      })
    },
    getDept() {
      dept.getUnitInfo().then(response => {
        this.verifyUnitList = response.data.items;
      })
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
  width: 450px;
}
</style>

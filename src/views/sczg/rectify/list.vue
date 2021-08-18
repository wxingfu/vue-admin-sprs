<template>
  <div class="app-container">
    <el-container>

      <el-header>
        <!--查询表单-->
        <el-form :inline="true"
                 ref="queryForm"
                 class="queryForm"
                 size="small"
                 style="width: 100%" type="flex">

          <el-form-item>
            <el-select clearable class="itemSelect"
                       v-model="rectifyInfo.rectifyUnit"
                       placeholder="选择整改单位">
              <el-option v-for="runit in rectifyUnitList"
                         :key="runit" :label="runit" :value="runit"></el-option>
            </el-select>

            <el-select clearable class="itemSelect"
                       v-model="rectifyInfo.inspectUnit"
                       placeholder="选择检查单位">
              <el-option v-for="iunit in inspectUnitList"
                         :key="iunit" :label="iunit" :value="iunit"></el-option>
            </el-select>

            <el-select clearable class="itemSelect" style="width: 130px"
                       v-model="rectifyInfo.rectifyComplete"
                       placeholder="选择整改状态">
              <el-option label="未整改" value="NotRectified"></el-option>
              <el-option label="已整改" value="Rectified"></el-option>
              <el-option label="已验证" value="Verified"></el-option>
              <el-option label="已签字" value="Signed"></el-option>
            </el-select>

            <el-input clearable class="inputClass"
                      v-model="rectifyInfo.rectifyContent"
                      placeholder="输入整改项"></el-input>
            <el-input clearable class="inputClass"
                      v-model="rectifyInfo.inspectPerson"
                      placeholder="输入检查人"></el-input>
            <el-input clearable class="inputClass"
                      v-model="rectifyInfo.rectifyPerson"
                      placeholder="输入整改人"></el-input>

            <el-date-picker class="timeSelect"
                            v-model="rectifyInfo.inspectDateStart"
                            type="date"
                            placeholder="选择开始时间"
                            value-format="yyyy-MM-dd"/>
            <el-date-picker class="timeSelect"
                            v-model="rectifyInfo.inspectDateEnd"
                            type="date"
                            placeholder="选择截止时间"
                            value-format="yyyy-MM-dd"/>

            <el-button type="primary"
                       size="small"
                       round plain
                       @click="getRectifyItemList()">查询
            </el-button>
            <el-button type="info"
                       size="small"
                       round plain
                       @click="resetData()">清空
            </el-button>
            <el-button type="default"
                       size="small"
                       round plain
                       @click="exportData()">导出
            </el-button>
            <el-button type="danger"
                       size="small"
                       round plain
                       @click="deleteSelected()">删除
            </el-button>
          </el-form-item>
        </el-form>
      </el-header>

      <el-main>
        <!--表格-->
        <!--:cell-style="{'text-align':'left'}"-->
        <el-table class="myForm" ref="multipleTable"
                  v-loading="listLoading"
                  :data="rectifyItems"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  border fit highlight-current-row
                  :header-cell-style="{'text-align':'center'}"
                  max-height="100%"
                  :default-sort="{prop: 'serialNumber', order: 'descending'}"
                  :cell-style="{'text-align':'center'}"
                  @selection-change="handleSelectionChange">
          <!--@select="selectChange"-->
          <!--复选框-->
          <el-table-column fixed type="selection" width="40"
                           :selectable="selectable"></el-table-column>
          <!--编号-->
          <el-table-column prop="serialNumber" label="编号" width="100" align="center"></el-table-column>
          <!--整改项目-->
          <el-table-column prop="rectifyContent" label="整改项目" width="300">
            <template slot-scope="scope">
              <el-popover placement="top" trigger="click"
                          :disabled="scope.row.problemPicture===''||scope.row.problemPicture===null">
                <img :src="scope.row.problemPicture"
                     :alt="scope.row.rectifyContent"
                     style="width: 100%;height: 100%;">
                <a style="color: #409EFF;text-decoration:underline;"
                   slot="reference">{{ scope.row.rectifyContent }}</a>
                <!--<el-button type="text" size="small" slot="reference">{{ scope.row.rectifyContent }}</el-button>-->
              </el-popover>
            </template>
          </el-table-column>
          <!--检查时间-->
          <el-table-column prop="inspectDate" label="检查时间" width="95"></el-table-column>
          <!--整改单位-->
          <el-table-column prop="rectifyUnit" label="整改单位" width="180"></el-table-column>
          <!--整改完成期限-->
          <el-table-column prop="expiryDate" label="整改完成期限" width="110"></el-table-column>
          <!--检查人-->
          <el-table-column prop="inspectPerson" label="检查人" width="150"></el-table-column>
          <!--提交人-->
          <el-table-column prop="upPerson" label="提交人" width="150"></el-table-column>
          <!--整改完成日期-->
          <el-table-column prop="rectifyCompleteDate" label="整改完成日期" width="110"></el-table-column>
          <!--整改人-->
          <el-table-column prop="rectifyPerson" label="整改人" width="150"></el-table-column>
          <!--整改完成图片-->
          <el-table-column prop="picture" label="整改完成图片" width="110" align="center">
            <template slot-scope="scope">
              <router-link :to="'/rectify/rectified/'+scope.row.serialNumber">
                <el-button v-if="scope.row.rectifyPicture===null||scope.row.rectifyPicture===''"
                           type="text" size="mini">上传
                </el-button>
                <el-button v-else type="text" size="mini">修改</el-button>
              </router-link>
              <el-popover placement="top" trigger="click">
                <el-button type="text" size="mini" slot="reference"
                           :disabled="scope.row.rectifyPicture===null||scope.row.rectifyPicture===''">查看
                </el-button>
                <img :src="scope.row.rectifyPicture"
                     style="width: 100%;height: 100%"
                     :alt="scope.row.rectifyPicture">
              </el-popover>
            </template>
          </el-table-column>
          <!--验证单位-->
          <el-table-column prop="verifyUnit" label="验证单位" width="180"></el-table-column>
          <!--验证日期-->
          <el-table-column prop="verifyDate" label="验证日期" width="95"></el-table-column>
          <!--验证-->
          <el-table-column prop="verify" label="验证" width="120" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.verifyContent===null||scope.row.verifyContent===''"
                         type="text" size="mini"
                         :disabled="scope.row.rectifyPicture===null||scope.row.rectifyPicture===''"
                         @click="toVerify(scope.row.serialNumber)">验证
              </el-button>
              <p v-else>{{ scope.row.verifyContent }}</p>
            </template>
          </el-table-column>
          <!--检查单位领导签字-->
          <el-table-column prop="inspectLeader" label="检查单位领导签字" width="140">
            <template slot-scope="scope">
              <el-button id="signBtn" v-if="scope.row.inspectLeader===null||scope.row.inspectLeader===''"
                         type="text" size="mini"
                         :disabled="scope.row.verifyContent===null||scope.row.verifyContent===''"
                         @click="sign(scope.row.serialNumber)">签字
              </el-button>
              <p v-else>{{ scope.row.inspectLeader }}</p>
            </template>
          </el-table-column>
          <!--添加日期-->
          <el-table-column prop="insertDate" label="添加日期" width="95"></el-table-column>
          <!--操作-->
          <el-table-column
            fixed="right" prop="operation" label="操作" width="95" align="center">
            <template slot-scope="scope">
              <router-link :to="'/rectify/update/'+scope.row.serialNumber">
                <el-button circle icon="el-icon-edit" size="mini" type="primary"></el-button>
              </router-link>
              <el-button circle icon="el-icon-delete" size="mini" type="danger"
                         @click="removeRectifyItem(scope.row.serialNumber)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <!--分页导航条-->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.prop="currentPage"
          :page-sizes="[5,10,15,20,50,100]"
          :page-size.sync="pageSize"
          style="padding: 30px 0; text-align: center"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

import dept from '@/api/dept'
import rectify from "@/api/rectify";
import {mapGetters} from "vuex";

export default {
  name: "list",
  data() {
    return {
      // listTableHeight: 0,
      // tableHeight: 500,
      // 分页参数
      currentPage: 1, //当前页
      pageSize: 5, //每页记录数
      pageTotal: 0, //总记录数
      listLoading: true, // 是否显示loading信息
      // 查询表单参数
      rectifyInfo: {
        name: '',
        role: '',
        rectifyUnit: '',
        rectifyContent: '',
        rectifyPerson: '',
        inspectUnit: '',
        inspectPerson: '',
        rectifyComplete: '',
        inspectDateStart: '',
        inspectDateEnd: '',
      },
      rectifyUnitList: [],
      inspectUnitList: [],
      // 表格数据
      rectifyItems: [],
      // 多选数据
      multipleSelection: [],
      // 编号数组
      rids: [],
      baseApi: process.env.BASE_API,
    }
  },

  created() {
    this.rectifyInfo.role = this.roles[0]
    this.rectifyInfo.name = this.name
    this.getUnitInformation();
    this.getRectifyItemList();
  },
  // 监听查询表单，更新表格数据
  watch: {
    rectifyInfo: {
      handler(val, oldVal) {
        this.getRectifyItemList();
        // console.log(val, oldVal);
      },
      deep: true
    },
  },
  computed: {
    ...
      mapGetters([
        'name',
        'roles'
      ])
  },
  methods: {
    getRectifyItemList(page = 1) {
      this.currentPage = page;
      // 调用条件分页查询方法
      this.listLoading = true
      // alert(this.rectifyInfo.name)
      rectify.getRectifyItems(this.currentPage, this.pageSize, this.rectifyInfo)
        .then(response => {
          if (response.success === true) {
            this.rectifyItems = response.data.items
            this.pageTotal = response.data.total
          }
          this.listLoading = false
        })
    },
    getUnitInformation() {
      dept.getUnitInfo().then(response => {
        this.rectifyUnitList = response.data.items;
        this.inspectUnitList = response.data.items;
      })
    },
    // 操作
    removeRectifyItem(Id) {
      this.$confirm('此操作将删除该项，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(Id)
        return rectify.removeRectifyItemById(Id)
      }).then(() => {
        this.getRectifyItemList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    // 跳转到验证添加页面
    toVerify(rid) {
      this.$router.push({path: '/rectify/verify/' + rid})
    },
    sign(rid) {
      this.$confirm('确认是否签字?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(rid + this.name)
        return rectify.signName(rid, this.name)
      }).then(() => {
        this.getRectifyItemList()
        this.$message({
          type: 'success',
          message: '签字成功!'
        })
      })
    },
    // 清空查询表单
    resetData() {
      // 清空表单输入项数据
      this.rectifyInfo = {}
      this.rectifyInfo.role = this.roles[0]
      this.rectifyInfo.name = this.name
      // 刷新表单，即调用条件分页查询
      this.getRectifyItemList();
    },
    // 导出方法
    exportData() {
      // console.log(this.multipleSelection)
      if (this.multipleSelection == null || this.multipleSelection.length === 0) {
        this.$message.error("至少选中一条有效数据")
        return;
      }
      // 标记是否包含为签字项
      let flag = true;
      // 重置数组，避免重复数据
      this.rids = []
      this.multipleSelection.forEach(item => {
        // 检查是否包含了没有完成签字的整改项，如果包含了则直接退出，不可以导出
        if (item.inspectLeader === '' || item.inspectLeader == null) {
          this.$message.error("选中数据包含了未完成签字项")
          flag = false;
          return;
        }
        this.rids.push(item.serialNumber)
      })
      if (flag) {
        // 调用后台方法，导出word文件
        this.$confirm('确认是否导出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.baseApi + '/file/word/export?rids=' + this.rids
          window.open(url)
        }).catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel' ? '放弃导出并离开页面' : '停留在当前页面'
          })
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectable(row, index) {
      // console.log(row.inspectLeader)
      // return row.inspectLeader !== '' && row.inspectLeader != null;
      // 默认不禁用复选框
      return true;
    },
    // 导航条
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRectifyItemList();
    }
    ,
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRectifyItemList(this.currentPage);
    },


    deleteSelected() {
      if (this.multipleSelection == null || this.multipleSelection.length === 0) {
        this.$message.error("至少选中一条数据")
        return;
      }
      // 重置数组，避免重复数据
      this.rids = []
      this.multipleSelection.forEach(item => {
        this.rids.push(item.serialNumber)
      })
      this.$confirm('确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rectify.removeSelected(this.rids).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRectifyItemList()
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel' ? '放弃删除并离开页面' : '停留在当前页面'
        })
      })
    }
  }
}
</script>

<style lang="scss">

.el-form-item {
  height: 30px;
}

.myForm {
  height: calc(100% - 500px);
}

.el-popover {
  width: 40%;
  height: 50%;
}

</style>

<style scoped>


.itemSelect {
  width: 150px;
}

.inputClass {
  width: 120px;
}

.timeSelect {
  width: 140px;
}

</style>

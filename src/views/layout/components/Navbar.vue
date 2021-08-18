<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb/>
    <el-dropdown class="avatar-container" trigger="click">
      <!--<div class="avatar-wrapper">-->
      <!--  <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="">-->
      <!--  <i class="el-icon-caret-bottom"/>-->
      <!--</div>-->
      <span class="el-dropdown-link">
        {{ name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!--<el-dropdown-item divided>-->
        <!--  {{ name }}-->
        <!--</el-dropdown-item>-->
        <!--<router-link class="inlineBlock" to="/">-->
        <!--  <el-dropdown-item>-->
        <!--    Home-->
        <!--  </el-dropdown-item>-->
        <!--</router-link>-->
        <el-dropdown-item>
          <span style="display:block;" @click="">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span style="display:block;" @click="">刷新</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;

    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>


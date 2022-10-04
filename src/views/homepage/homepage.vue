<template>
  <div class="homepage_container">
    <div class="homepage_header">头部</div>
    <div class="homepage_menu">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        :unique-opened="true"
        :router="true"
      >
        <el-sub-menu
          :index="menu.id + ''"
          v-for="menu in newMenus"
          :key="menu.id"
        >
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
          <template v-for="submenu in menu.children">
            <el-menu-item
              :index="'/' + menu.name + '/' + submenu.name"
              v-if="!submenu.hidden"
              :key="submenu.id"
              >{{ submenu.title }}</el-menu-item
            >
          </template>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="homepage_content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";

interface MenuObj {
  parentId: number;
  id: number;
  title: string;
  hidden: 0 | 1;
  children?: MenuObj[];
  name: string;
}

interface NewMenus {
  [key: number]: MenuObj;
}

const store = useStore();
const newMenus = computed<NewMenus>(() => store.getters.getNewMenus);

</script>

<style lang='scss' scoped>
  $height:70px;
.homepage_container {
  position: relative;
  height: 100%;
  .homepage_header {
    height: $height;
    background-color: rgb(230, 189, 137);
  }
  .homepage_menu {
    position: absolute;
    top: $height;
    left: 0;
    bottom: 0;
    width: 250px;
    height: calc(100vh - $height);
    background: #545c64;
  }
  .homepage_content {
    position: absolute;
    top: 70px;
    right: 0;
    left: 250px;
    bottom: 0;
    height: calc(100vh - $height);
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar-track-piece {
      background-color: #d3d4da;
    }
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius:0px;background-color:#77797d;background-clip:padding-box;
    }
  }
}
</style>
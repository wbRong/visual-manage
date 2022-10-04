<!--  -->
<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" label="编号" />
    <el-table-column prop="username" label="账号" />
    <el-table-column prop="nickName" label="姓名" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column label="添加时间">
      <template #default="scope">{{
        formateDate(scope.row.createTime)
      }}</template>
    </el-table-column>
    <el-table-column label="最后时间">
      <template #default="scope">{{
        formateDate(scope.row.loginTime)
      }}</template>
    </el-table-column>
    <el-table-column label="是否启用">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text">分配角色</el-button>
        <el-button type="text" @click="editAdmin(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <EditAdmin :visible="visible" @close="closeDialog" :form="rowData" />
</template>

<script lang='ts' setup>
import { reactive, toRefs, ref } from "vue";
import { getUserLists } from "@/request/api";
import EditAdmin from "./components/EditAdmin.vue";

interface AdminObjItf {
  id?: number;
  username?: string;
  nickName?: string;
  email?: string;
  password?: string;
  note?: string;
  status?: number;
}

const a1 = ref(1); // {value: 1}
const state = reactive<{
  tableData: {}[];
  a: number;
  visible: boolean;
  rowData: AdminObjItf;
}>({
  tableData: [],
  a: 1,
  visible: false,
  rowData: {},
});

const { tableData, a, visible, rowData } = toRefs(state); // {value: 1}
// console.log(tableData, a)

const fetchData = async () => {
  let res = await getUserLists({
    keyword: "",
    pageSize: 10,
    pageNum: 1,
  });
  if (res.code === 200) {
    tableData.value = res.data.list;
  }
};

fetchData();

// 点击编辑按钮
const editAdmin = (row: AdminObjItf) => {
  visible.value = true;
  rowData.value = row;
};

const closeDialog = (r?: "reload") => {
  visible.value = false;
  if (r === "reload") {
    // 更新表格数据
    fetchData();
  }
};

// 格式化时间
const formateDate = (time: string | undefined) => {
  if (!time) return "";
  const date = new Date(time);
  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate());
  let hour = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let sec = addZero(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

const addZero = (num: number) => {
  return num > 9 ? num : "0" + num;
};
</script>

<style lang='scss' scoped>
</style>
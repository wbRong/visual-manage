<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    class="demo-ruleForm"
  >
    <el-form-item prop="user">
      <el-input v-model="ruleForm.user" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import Cookie from "js-cookie";
import { getLogin, getUserInfo } from "@/request/api";

const state = reactive({
  ruleForm: {
    user: "admin",
    pwd: "123456",
  },
});

const { ruleForm } = toRefs(state);

const validatePwd = (
  rule: unknown,
  value: string | undefined,
  cb: (msg?: string) => void
) => {
  if (!value) {
    cb("密码不能为空");
  } else {
    cb();
  }
};

const rules = reactive({
  user: [{ required: true, message: "用户名不能为空！", trigger: "blur" }],
  pwd: [{ validator: validatePwd, trigger: "blur" }],
});

let ruleFormRef = ref();
let router = useRouter();
let store = useStore();

const login = async () => {
  let valid = await ruleFormRef.value.validate();
  if (valid) {
    let res = await getLogin({
      username: ruleForm.value.user,
      password: ruleForm.value.pwd,
    });
    if (res.code === 200) {
      let { tokenHead, token } = res.data;
      Cookie.set("token", tokenHead + token, { expires: 1 });
      let result = await getUserInfo();
      store.dispatch('getAdminInfo', result.data.menus);
      router.push('/home');
    }
  } else {
    console.error("verification failed");
  }
};
</script>

<style scoped lang="scss">
</style>
import request from "./request"
import { id } from 'element-plus/lib/locale';
import qs from 'qs';

interface LoginResult<T> {
  code: number,
  message: number,
  data: T
}

type PromiseRes<T> = Promise<LoginResult<T>>

interface LoginData {
  token: string,
  tokenHead: string
}

interface UserInfoData {
  menus: [],
}

interface UserListParams { 
  keyword: string,
  pageNum: number, 
  pageSize: number
 }

 interface AdminObjItf {
  id?: number;
  username?: string;
  nickName?: string;
  email?: string;
  password?: string;
  note?: string;
  status?: number;
}

interface AdminRoleFormData {
  userRoles: RoleObjItf[];
  roleLists: RoleObjItf[];
  adminId: number;
}

interface IndexDataItf {
  salePie: {}[]
}

export const getLogin = (data: LoginData): PromiseRes<LoginData> => request.post("/admin/login", data)

export const getUserInfo = (): PromiseRes<UserInfoData> => request.get("/admin/info")

export const getUserLists = (data: UserListParams): PromiseRes<{ list: {}[] }> => request.get("/admin/list", { params: data })

export const updateAdmin = (id: number, data: AdminObjItf): PromiseRes => request.post('/admin/update/' + id, data)

export const updateAdminRole = (data: { adminId: number; roleIds: string }): PromiseRes => request.post('/admin/role/update', qs.stringify(data))

export const getAdminStat = (): PromiseRes<IndexDataItf> => request.get('http://kumanxuan1.f3322.net:8360/admin/stat')
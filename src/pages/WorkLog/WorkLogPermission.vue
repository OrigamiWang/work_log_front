<template>
  <div>
    <el-table
        height="637"
        :data="getList.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        v-loading="loading"
        :header-cell-style="{background:'#BCC7D4',color: '#3E4A5B'}"
        :cell-style="setCellColor"
    >
      <template slot="empty">
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column
          sortable
          prop="id"
          :label="$t('Permission.No')"
          width="250">
      </el-table-column>
      <el-table-column
          sortable
          prop="empId"
          :label="$t('Permission.EmpId')"
          width="300">
      </el-table-column>
      <el-table-column
          sortable
          prop="priority"
          :label="$t('Permission.Priority')"
          width="300">
      </el-table-column>
      <el-table-column
          :label="$t('Permission.name')">
        <template slot-scope="scope">
          <el-switch
              style="display: block"
              v-model="scope.row.priority"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="root"
              inactive-value="user"
              :active-text="$t('Permission.p1')"
              :inactive-text="$t('Permission.p2')"
              @change="changeSwitch(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input
              clearable
              id="a"
              v-model="search"
              size="mini"
              :placeholder="$t('Detail.Search')"/>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="2" :offset="7">
      <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10,25,50,100,200]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
      </el-pagination>
    </el-col>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WorkLogPermission",
  mounted() {
    this.empId = localStorage.getItem("empId");
    this.getPermissionList();
  },
  watch: {
    'fuzzyCount': function () {
      this.total = this.fuzzyCount;
    }
  },
  data() {
    return {
      empId: '',
      permissions: [],
      loading: false,
      search: '',
      pageNum: 1,   //当前页数
      pageSize: 10, //每页条数
      total: 0,//总条目数
      fuzzyCount: 0,
      p1: 'Root',
      p2: 'User',
    }
  },

  computed: {
    getList() {
      this.getCountByEmpId(this.search);
      // empId 为 0000 的是超级管理员，只有他才能管理其他所有人的权限
      // 而 管理员 只能管理 用户的权限
      // 而 用户没有管理权限
      if (this.empId === "0000") {
        return this.permissions
            .filter((data) => data.empId.includes(this.search))
            .filter(data => data.empId !== "0000");
      }
      return this.permissions
          .filter((data) => data.empId.includes(this.search))
          .filter(data => data.empId !== "0000")
          .filter(data => data.priority === "user");
    }
  },
  methods: {
    changeSwitch(row) {
      let priority = row.priority;
      let empId = row.empId;
      //调用后台接口:通过empId修改权限
      axios.get(`http://localhost:8888/permission/updatePriorityByEmpId?priority=${priority}&empId=${empId}`)
          .then(response => {
            if (response.data.code === 200) {
              localStorage.setItem('roles', priority);
              console.log("修改权限成功!");
            } else {
              alert("未知错误!");
            }
          })
          .catch(error => {
            console.log(error.message);
          })
    },
    setCellColor({row, rowIndex}) {
      row.color = 'color: #239ce6';
      if (rowIndex % 2 === 0) {
        return 'color:#3E4A5B; background: #F0F0F0'
      } else {
        return 'color:#3E4A5B; background: #E6E6E6'
      }
    },
    handleSizeChange(val) {
      //每页数据的条数
      this.pageSize = val;
      this.getPermissionList();
    },
    async getCountByEmpId(empId) {
      axios.get(`http://localhost:8888/permission/fuzzyGetCountByEmpId?empId=${empId}`)
          .then(
              response => {
                if (response.data.code === 200) {
                  this.fuzzyCount = response.data.data;
                }
              })
          .catch(
              error => {
                console.log(error.message);
              }
          )
    },
    handleCurrentChange(val) {
      //当前页码
      this.pageNum = val;
      this.getPermissionList();
    },
    async getPermissionList() {
      this.loading = true;
      axios.get('http://localhost:8888/permission/getPermissionList')
          .then(response => {
            if (response.data.code === 200) {
              this.permissions = response.data.data;
              this.loading = false;
            }
          })
          .catch(error => {
            console.log(error.message);
          })
    },
    async getCount() {
      axios.get('http://localhost:8888/permission/getPermissionCount')
          .then(
              response => {
                if (response.data.code === 200) {
                  this.total = response.data.data;
                }
              })
          .catch(
              error => {
                console.log(error.message);
              }
          )
    },
  }
}
</script>

<style scoped>

</style>
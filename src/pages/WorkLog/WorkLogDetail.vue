<template>
  <div>
    <el-table
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        ref="tableData"
        height="637"
        :data="WorkLogs"
        style="width: 100%"
        :default-sort="{prop: 'logDay', order: 'descending'}"
        :header-cell-style="{background:'#BCC7D4',color: '#3E4A5B'}"
        :cell-style="setCellColor"
    >
      <!--        默认按照日期降序排序-->

      <template slot="empty">
        <el-empty description="暂无数据"></el-empty>
      </template>

      <el-table-column
          sortable
          prop="no"
          :label="$t('Detail.No')"
          width="150">
      </el-table-column>

      <el-table-column
          sortable
          prop="empId"
          :label="$t('Detail.EmpId')"
          width="150">
      </el-table-column>

      <el-table-column
          sortable
          prop="name"
          :label="$t('Detail.Name')"
          width="150">
      </el-table-column>

      <el-table-column
          sortable
          prop="logDay"
          :label="$t('Detail.Date')"
          width="150">
        <template v-slot="scope1">
          <i class="el-icon-date">
            <span> {{ scope1.row.logDay }}</span>
          </i>
        </template>
      </el-table-column>

      <el-table-column
          sortable
          prop="workTime"
          :label="$t('Detail.WorkTime')"
          width="150">
        <template v-slot="scope1">
          <i class="el-icon-time">
            <span> {{ scope1.row.workTime }}</span>
          </i>
        </template>
      </el-table-column>

      <el-table-column
          prop="content"
          :label="$t('Detail.Content')"
          width="200">
      </el-table-column>

      <el-table-column>
        <template slot="header" slot-scope="scope">

          <el-input
              @input="getSearch"
              :disabled="canModify"
              clearable
              id="a"
              v-model="search"
              size="mini"
              :placeholder="$t('Detail.Search')">
          </el-input>
        </template>
        <template slot-scope="scope">

          <el-dialog
              :title="$t('Dialog.editTitle')"
              :visible.sync="dialogFormVisible"
              :before-close="closeEdit">
            <el-form :model="workLogForm" ref="workLogForm" :label-width="formLabelWidth" :rules="rules"
                     class="demo-ruleForm">
              <el-form-item prop="empId" :label="$t('Dialog.EmpId')" required>
                <el-input :disabled="canModify" v-model="workLogForm.empId" minlength="1" maxlength="20" show-word-limit
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item prop="name" :label="$t('Dialog.Name')" required>
                <el-input v-model="workLogForm.name" minlength="1" maxlength="20" show-word-limit
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item prop="content" :label="$t('Dialog.Content')" required>
                <el-input v-model="workLogForm.content"
                          type="textarea"
                          minlength="1"
                          maxlength="200"
                          show-word-limit
                          autocomplete="off"></el-input>
              </el-form-item>


              <el-form-item label="时间" required>
                <el-col :span="11">
                  <el-date-picker
                      type="date"
                      :picker-options="pickerOptions"
                      placeholder="选择日期"
                      v-model="workLogForm.logDay"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-time-picker
                      value-format="HH:mm:ss"
                      placeholder="选择时间"
                      v-model="workLogForm.workTime"
                      style="width: 100%;"
                  ></el-time-picker>
                </el-col>
              </el-form-item>
              <el-form-item style="text-align: right">
                <el-button type="primary" @click="handleEdit('workLogForm')">{{ $t("Dialog.Submit") }}</el-button>
                <el-button @click="resetForm('workLogForm')">{{ $t("Dialog.Reset") }}</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog
              :append-to-body=true
              :title="$t('Dialog.addTitle')"
              :visible.sync="dialogFormVisible2"
              :before-close="closeAdd">
            <el-form :model="workLogForm2" ref="workLogForm2" :rules="rules" :label-width="formLabelWidth"
                     class="demo-ruleForm">
              <el-form-item prop="empId" :label="$t('Dialog.EmpId')" required>
                <el-input :disabled="canModify" v-model="workLogForm2.empId" minlength="1" maxlength="20"
                          show-word-limit
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item prop="name" :label="$t('Dialog.Name')" required>
                <el-input v-model="workLogForm2.name" minlength="1" maxlength="20" show-word-limit
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item prop="content" :label="$t('Dialog.Content')" required :label-width="formLabelWidth">
                <el-input type="textarea" minlength="1" maxlength="200" show-word-limit autosize
                          v-model="workLogForm2.content" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item :label="$t('Dialog.Time')" required>
                <el-col :span="11">
                  <el-date-picker
                      type="date"
                      :picker-options="pickerOptions"
                      placeholder="选择日期"
                      v-model="workLogForm2.logDay"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-time-picker
                      value-format="HH:mm:ss"
                      placeholder="选择时间"
                      v-model="workLogForm2.workTime"
                      style="width: 100%;"
                  ></el-time-picker>
                </el-col>
              </el-form-item>


              <el-form-item style="text-align: right">
                <el-button type="primary" @click="handleAdd('workLogForm2')">{{ $t("Dialog.Submit") }}</el-button>
                <el-button @click="resetForm('workLogForm2')">{{ $t("Dialog.Reset") }}</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-button
              plain
              type="info"
              icon="el-icon-edit"
              size="mini"
              @click="editWorkLog(scope.row)">{{ $t("Detail.Edit") }}
          </el-button>


          <el-button
              plain
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="delWorkLog(scope.row)">{{ $t("Detail.Del") }}
          </el-button>


          <el-dialog
              :title="$t('Dialog.AlertDel.title')"
              style="text-align:left !important"
              :visible.sync="dialog2Visible"
              :before-close="closeDel">
            <span>
              <i class="el-icon-warning"></i>
              {{ $t("Dialog.AlertDel.msg") }}
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleDelete($event)">{{ $t("Dialog.AlertDel.yes") }}</el-button>
              <el-button type="primary" @click="cancelDel">{{ $t('Dialog.AlertDel.no') }}</el-button>
            </span>
          </el-dialog>

        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="2" :offset="5">
        <el-button
            plain
            type="primary"
            @click="dialogFormVisible2 = true;"
            icon="el-icon-plus"
            size="mini"
        >{{ $t("Detail.Add") }}
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-pagination
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10,25,50,100,200]"
            :page-size="25"
            layout="sizes, prev, pager, next"
            :total="total">
        </el-pagination>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['reload'],
  name: "WorkLogDetail",
  computed: {
    //表单规则验证国际化，需要用computed而不是data
    rules() {
      return {
        empId: [
          {required: true, message: this.$t('Dialog.Alert.EmpIdMsg1'), trigger: 'blur'},
        ],
        name: [
          {required: true, message: this.$t('Dialog.Alert.NameMsg1'), trigger: 'blur'},
        ],
        content: [
          {required: true, message: this.$t('Dialog.Alert.ContentMsg1'), trigger: 'blur'},
        ],
        logDay: [
          {required: true, message: this.$t('Dialog.Alert.LogDayMsg'), trigger: 'blur'},
        ],
        workTime: [
          {required: true, message: this.$t('Dialog.Alert.workTime'), trigger: 'blur'},
        ],
      }
    }
  },
  data() {
    return {
      pickerMinDate: '', //获取开始选择时间
      pickerMaxDate: new Date(), //结束选择时间（当天）
      pickerOptions: {
        //时间范围选择控制（禁止选择的时间范围）
        disabledDate: time => {
          const day30 = 30 * 24 * 3600 * 1000 //时间范围：30天
          let minTime = this.pickerMaxDate - day30;
          return time.getTime() < minTime || time.getTime() > Date.now()
        },
      },
      canModify: true,
      loading: false,
      noToDel: '',
      search: '',
      WorkLogs: [],
      workLog: {},
      dialogFormVisible: false, //修改页面
      dialogFormVisible2: false,  //添加页面
      dialog2Visible: false,
      workLogForm: {
        empId: '',
        name: '',
        content: '',
        logDay: '',
        workTime: '',
        no: ''
      },
      workLogForm2: {
        empId: localStorage.getItem('empId'),
        name: '',
        content: '',
        logDay: '',
        workTime: '',
        no: ''
      },
      formLabelWidth: '120px',
      pageNum: 1,   //当前页数
      pageSize: 10, //每页条数
      total: 0,//总条目数
      fuzzyCount: 0,

    }

  },

  watch: {
    'fuzzyCount': function () {
      this.total = this.fuzzyCount;
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout();
    })
  },
  mounted() {
    this.getLogList();
    this.isModify();
  },
  methods: {
    getSearch() {
      this.getLogList();
    },
    isModify() {
      this.canModify = localStorage.getItem('roles') !== 'root';
    },
    setCellColor({row, rowIndex}) {
      row.color = 'color: #239ce6';
      if (rowIndex % 2 === 0) {
        return 'color:#3E4A5B; background: #F0F0F0'
      } else {
        return 'color:#3E4A5B; background: #E6E6E6'
      }
    },
    closeDel(done) {
      this.$message({
        showClose: true,
        message: '取消删除',
        type: 'info'
      });
      done();
    },
    cancelDel() {
      this.dialog2Visible = false;
      this.$message({
        showClose: true,
        message: '取消删除 ',
        type: 'info'
      });
    },
    getSummaries(param) {
      const {columns, data} = param;
      let regForWorkTime = /([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/;

      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => (regForWorkTime.test(item[column.property]) ? item[column.property] : ''));
        if (index === 0) {
          sums[index] = '总时长';
          return;
        }
        if (values.every(value => value !== '')) {
          sums[index] = values.reduce((prev, curr) => {
            if (prev === 0) {
              return curr;
            }
            let arr1 = prev.split(":");
            let arr2 = curr.split(":");
            let h1 = parseInt(arr1[0]);
            let h2 = parseInt(arr2[0]);
            let m1 = parseInt(arr1[1]);
            let m2 = parseInt(arr2[1]);
            let s1 = parseInt(arr1[2]);
            let s2 = parseInt(arr2[2]);
            let h = h1 + h2;
            let m = m1 + m2;
            let s = s1 + s2;
            let s3 = s % 60; // 真正的秒
            let extraS = (s - s3) / 60; // 多余的秒转成了分
            let m3 = (m + extraS) % 60; // 真正的分
            let extraH = (m + extraS - m3) / 60  // 多余的分转成了时
            h = h + extraH;
            return h + ':' + m3 + ':' + s3;
          }, 0);
          if (typeof sums[index] === "string") {
            let h = sums[index].split(':')[0];
            let m = sums[index].split(':')[1];
            let s = sums[index].split(':')[2];
            sums[index] = h + "时" + m + "分" + s + "秒";
          }
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    handleSizeChange(val) {
      //每页数据的条数
      this.pageSize = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      //当前页码
      this.pageNum = val;
      this.getLogList();
    },
    async handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //成功
          let empId = this.workLogForm2.empId;
          let name = this.workLogForm2.name;
          let content = this.workLogForm2.content;
          let logDay = this.workLogForm2.logDay;
          let workTime = this.workLogForm2.workTime;

          axios.get(`http://localhost:8888/log/insert?empId=${empId}&name=${name}&content=${content}&logDay=${logDay}&workTime=${workTime}`)
              .then(
                  response => {
                    let code = response.data.code;
                    //通过后台数据判断是否成功
                    if (code === 200) {
                      //成功
                      this.$message({
                        showClose: true,
                        message: '添加成功 ',
                        type: 'success'
                      });
                      //清空
                      this.workLog = {};
                      //关闭添加界面
                      this.dialogFormVisible2 = false;
                      //刷新
                      this.reload();
                    }
                  })
              .catch(
                  error => {
                    //失败也要清除workLog
                    this.workLog = {};
                    console.log(error.message);
                    this.$message({
                      showClose: true,
                      message: '添加失败 ',
                      type: 'error'
                    });
                  }
              )
        }
      });
    },
    closeEdit(done) {
      this.$message({
        type: 'info',
        message: '取消修改'
      });
      done();
    },
    closeAdd(done) {
      this.$message({
        type: 'info',
        message: '取消添加'
      });
      done();
    },
    async handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //成功
          let no = this.workLogForm.no;
          let empId = this.workLogForm.empId;
          let name = this.workLogForm.name;
          let content = this.workLogForm.content;
          let logDay = this.workLogForm.logDay;
          let workTime = this.workLogForm.workTime;
          //执行更新逻辑
          axios.get(`http://localhost:8888/log/updateByNo?no=${no}&name=${name}&empId=${empId}&content=${content}&logDay=${logDay}&workTime=${workTime}`)
              .then(
                  response => {
                    if (response.data.code === 200) {
                      // 成功
                      this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                      });
                      // 清零
                      this.workLog = {};
                      //关闭编辑界面
                      this.dialogFormVisible = false;
                      // 刷新页面
                      this.reload();
                    } else {
                      alert("编辑失败");
                    }
                  })
              .catch(error => {
                console.log(error.message);
                this.$message({
                  type: 'error',
                  message: '更新失败'
                });
              })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async getLogList() {
      this.loading = true;
      axios.get('http://localhost:8888/log/getLogList')
          .then(
              response => {
                this.loading = false;
                if (localStorage.getItem('roles').includes('root')) {
                  let list = response.data.data;

                  //将对象转化成数组
                  let array = [];
                  array.push(list);
                  let res = array[0].filter(data => data.empId.includes(this.search));
                  //页码切换
                  this.total = res.length;

                  this.WorkLogs = res;
                  this.WorkLogs = res.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);
                } else {
                  let empId = window.localStorage.getItem('empId');
                  let a = response.data.data.filter((data) => data.empId === empId)
                      .filter(data => (Date.parse(new Date()) - Date.parse(data.logDay)) / (1000 * 60 * 60 * 24) <= 30)
                  this.total = a.length;
                  this.WorkLogs = a.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);
                }
              })
          .catch(
              error => {
                console.log(error.message);
                this.loading = false;
                this.$message({
                  type: 'error',
                  message: '获取数据失败'
                });
              }
          )
    },
    editWorkLog(row) {
      // 复现
      this.workLogForm = JSON.parse(JSON.stringify(row));
      // this.workLog = row;
      this.dialogFormVisible = true;
    },
    delWorkLog(row) {
      this.dialog2Visible = true;
      this.noToDel = row.no;
    },
    handleDelete(e) {
      axios.get(`http://localhost:8888/log/deleteByNo?no=${this.noToDel}`)
          .then(
              response => {
                if (response.data.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '删除成功 ',
                    type: 'success'
                  });
                  let target = e.target;
                  // 让button失去焦点?????
                  target.blur();
                  this.dialog2Visible = false;
                  this.reload();
                } else {
                  alert("删除失败");
                }
              })
          .catch(
              error => {
                console.log("删除失败", error.message);
                this.$message({
                  type: 'error',
                  message: '删除失败'
                });
              }
          )
    }
  },
}
</script>

<style scoped>


.el-table {
  overflow: visible !important;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #009688;
  color: #fff;
}


/deep/ .el-table .sort-caret.descending {
  border-top-color: white;
}

/deep/ .el-table .sort-caret.ascending {
  border-bottom-color: white;
}

/deep/ .descending .sort-caret.descending {
  border-top-color: #3958FE;
}

/deep/ .ascending .sort-caret.ascending {
  border-bottom-color: #3958FE;
}

</style>
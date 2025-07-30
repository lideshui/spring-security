Vue.component('mqtt-record-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">消息队列<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>MQTT消息记录</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">MQTT消息记录</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="mqttRecord.policyName" class="search-item" clearable size="small" placeholder="请输入策略名称"></el-input>
            <el-input v-model="mqttRecord.topic" class="search-item" clearable size="small" placeholder="请输入策略Topic"></el-input> 
            <el-input v-model="mqttRecord.payload" class="search-item" clearable size="small" placeholder="请输入推送内容"></el-input> 
            <el-select v-model="mqttRecord.messageType" class="search-item" filterable clearable size="small" placeholder="请选择消息状态">
                <el-option
                        v-for="item in messageTypeOptions"
                        :key="item.prop"
                        :label="item.label"
                        :value="item.prop">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="queryPageList()">查询</el-button>
        </div>
        <el-divider style="margin: 0!important;"></el-divider>
        <!-- 表格部分 -->
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <!-- 消息状态 -->
            <el-table-column
                label="消息状态"
                width="100"
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.recordStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 正常</span>
                    <span v-else-if="scope.row.recordStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 异常</span>
                    <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                </template>
            </el-table-column>
            <!-- 消息类型 -->
            <el-table-column
                label="消息类型"
                width="100"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.recordStatus === 0" >推送</span>
                    <span v-else>接收</span>
                </template>
            </el-table-column>
            <!-- 策略名称 -->
            <el-table-column
                label="策略名称"
                width="150"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.policyName}}
                </template>
            </el-table-column>
            <!-- 策略Topic -->
            <el-table-column
                label="策略Topic"
                width="150"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.topic}}
                </template>
            </el-table-column>
            <!-- 推送内容 -->
            <el-table-column
                label="推送内容"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.payload}}
                </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column
                label="创建时间"
                width="150"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.createdTime}}
                </template>
            </el-table-column> 
            <!-- 操作列 -->
            <el-table-column
                label="操作"
                width="120"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" @click="handleShow(scope.row)">查看</el-link>
                    <el-link class="link-container" type="primary" @click="handleDelete(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <el-pagination
            class="pagination-container"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="mqttRecord.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="mqttRecord.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mqttRecord.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            mqttRecord: {
                mqttRecordId: '',
                topic: '',
                payload: '',
                messageType: '',
                recordStatus: '',
                exceptionInfo: '',
                policyName: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            loading: true,
            multipleSelection: [],
            messageTypeOptions: [
                { prop: 0, label: '正常' },
                { prop: 1, label: '异常' },
            ],
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/mqttRecord/getPageList", {
                    params: { ...this.mqttRecord }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.mqttRecord.total = response.data.data.total
            } catch (error) {
                console.error("获取分页列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/mqttRecord/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
                        this.multipleSelection = []
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("删除失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 批量删除操作
        handleBatchDelete() {
            if(this.multipleSelection.length < 1 ){
                this.$message.warning("请至少选择一条需要删除的数据");
                return;
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/mqttRecord/batchDelete', this.multipleSelection)
                    .then(response => {
                        this.$message.success("批量删除成功");
                        // 刷新列表
                        this.queryPageList();
                    })
                    .catch(error => {
                        this.$message.error("批量删除失败: " + error.message);
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            }).finally(() => {
                this.multipleSelection = []
            })
        },
        // 分页插件事件
        handleCurrentChange(val) {
            this.mqttRecord.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.mqttRecord.pageSize = val
            this.mqttRecord.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'mqtt-record-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
    }
})
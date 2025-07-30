Vue.component('mqtt-policy-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">消息队列<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>MQTT推送策略</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">MQTT推送策略</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="handleCreate">添加推送策略</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="mqttPolicy.policyName" class="search-item" clearable size="small" placeholder="请输入策略名称"></el-input>
            <el-input v-model="mqttPolicy.topic" class="search-item" clearable size="small" placeholder="请输入推送主题"></el-input> 
            <el-select v-model="mqttPolicy.policyStatus"  class="search-item" filterable clearable size="small" placeholder="请选择策略状态">
                <el-option
                        v-for="item in policyStatusOptions"
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
            <!-- 状态列 -->
            <el-table-column
                label="策略状态"
                width="100">
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.policyStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 开启</span>
                    <span v-else-if="scope.row.policyStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 关闭</span>
                    <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                </template>
            </el-table-column>
            <!-- 动态渲染 -->
            <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                show-overflow-tooltip
            />
            <!-- 关联网关 -->
            <el-table-column
                label="关联网关"
                align="left">
                <template slot-scope="scope">
                    <span style="color: #409EFF; cursor: pointer" @click="handleShowGateway(scope.row.gatewayList)">{{scope.row.gatewayList.length}}</span>
                </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column
                label="创建时间"
                align="left">
                <template slot-scope="scope">
                  {{scope.row.createdTime}}
                </template>
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column
                label="操作"
                width="180"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" @click="handleShow(scope.row)">查看</el-link>
                    <el-link class="link-container" type="primary" @click="handleEdit(scope.row)">修改</el-link>
                    <el-link class="link-container" type="primary" @click="handleDelete(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <el-pagination
            class="pagination-container"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="mqttPolicy.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="mqttPolicy.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mqttPolicy.total">
        </el-pagination>
        <!-- 对话框 -->
        <el-dialog title="关联网关" :visible.sync="dialogGatewayVariable" width="40%" style="min-width: 620px">
            <el-table :data="gatewayTableData">
                <!-- 状态列 -->
                <el-table-column
                    label="网关状态"
                    width="120">
                    align="left">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gatewayStatus === 0" style="color: #13ce66"><i class="el-icon-upload"></i> 在线</span>
                        <span v-else-if="scope.row.gatewayStatus === 1" style="color: #cd6767"><i class="el-icon-upload"></i> 离线</span>
                        <span v-else-if="scope.row.gatewayStatus === 2" style="color: #f1a633"><i class="el-icon-upload"></i> 停用</span>
                        <span v-else style="color: #b3b5b4"><i class="el-icon-upload"></i> 无效状态</span>
                    </template>
                </el-table-column>
                <el-table-column property="gatewayName" label="网关名称"></el-table-column>
                <el-table-column property="gatewayCode" label="网关编码"></el-table-column>
                <el-table-column property="gatewayIp" label="网关IP" width="150"></el-table-column>
                <!-- 操作列 -->
                <el-table-column
                    label="操作"
                    width="80"
                    align="left">
                    <template slot-scope="scope">
                        <el-link class="link-container" type="primary" @click="handleGatewayShow(scope.row)">查看</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            mqttPolicy: {
                mqttPolicyId: '',
                policyName: '',
                policyTemplate: '',
                policyStatus: '',
                topic: '',
                cronExpression: '',
                gatewayList: [],
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'policyName', label: '策略名称' },
                { prop: 'policyTemplate', label: '推送模板' },
                { prop: 'topic', label: '推送主题' },
                { prop: 'cronExpression', label: '推送策略表达式' },
            ],
            loading: true,
            multipleSelection: [],
            policyStatusOptions: [
                { prop: 0, label: '开启' },
                { prop: 1, label: '关闭' },
            ],
            dialogGatewayVariable: false,
            gatewayTableData: [],
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
                const response = await axios.get("/api/mqttPolicy/getPageList", {
                    params: { ...this.mqttPolicy }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.mqttPolicy.total = response.data.data.total
            } catch (error) {
                console.error("获取分页列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 查看网关列表
        handleShowGateway(gatewayList){
            this.dialogGatewayVariable = true
            this.gatewayTableData = gatewayList
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/mqttPolicy/delete', row)
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
                axios.post('/api/mqttPolicy/batchDelete', this.multipleSelection)
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
            this.mqttPolicy.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.mqttPolicy.pageSize = val
            this.mqttPolicy.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 修改跳转
        handleEdit(row) {
            let paramObj = {
                component: 'mqtt-policy-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看跳转
        handleShow(row) {
            let paramObj = {
                component: 'mqtt-policy-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增跳转
        handleCreate() {
            let paramObj = {
                component: 'mqtt-policy-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
        // 查看关联网关详情跳转
        handleGatewayShow(row) {
            let paramObj = {
                component: 'gateway-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
    }
})
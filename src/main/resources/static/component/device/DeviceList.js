Vue.component('device-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">设备管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>设备列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">设备列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="handleCreate">添加设备</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
            <el-button size="mini" type="primary" plain @click="openBatchSetGateway">批量关联网关</el-button>
            <el-button size="mini" type="primary" plain @click="openBatchSetTemplate">批量关联模板</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="device.deviceName" class="search-item" clearable size="small" placeholder="请输入设备名称"></el-input>
            <el-input v-model="device.deviceCode" class="search-item" clearable size="small" placeholder="请输入设备编码"></el-input> 
            <el-input v-model="device.deviceAddressBit" class="search-item" clearable size="small" placeholder="请输入十进制地址位"></el-input> 
            <el-input v-model="device.deviceNumber" class="search-item" clearable size="small" placeholder="请输入设备编号"></el-input>
            <el-select v-model="device.templateId"  class="search-item" filterable clearable size="small" placeholder="请选择关联模板">
                <el-option
                        v-for="item in templateOptions"
                        :key="item.templateId"
                        :label="item.templateName"
                        :value="item.templateId">
                </el-option>
            </el-select>
            <el-select v-model="device.gatewayId" class="search-item" filterable clearable size="small" placeholder="请选择关联网关">
                <el-option
                        v-for="item in gatewayOptions"
                        :key="item.gatewayId"
                        :label="item.gatewayName"
                        :value="item.gatewayId">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="handleQuery()">查询</el-button>
        </div>
        <el-divider style="margin: 0!important;"></el-divider>
        <!-- 表格部分 -->
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <!-- 动态渲染 -->
            <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
            />
            <!-- 网关列 -->
            <el-table-column
                label="设备网关"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" v-if="scope.row.gatewayId == null || scope.row.gatewayId == ''" @click="handleSetGateway(scope.row)">关联</el-link>
                    <span v-else >{{scope.row.gatewayName}}</span>
                </template>
            </el-table-column>
            <!-- 模板列 -->
            <el-table-column
                label="设备模板"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" v-if="scope.row.templateId == null || scope.row.templateId == ''" @click="handleSetTemplate(scope.row)">关联</el-link>
                    <span v-else >{{scope.row.templateName}}</span>
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
            :current-page="device.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="device.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="device.total">
        </el-pagination>
        <!-- 批量关联网关 -->
        <el-dialog title="请选择关联网关" :visible.sync="dialogSetGateway" width="400px" @closed="handleClosed">
            <div style="margin-top: -10px; text-align: center">
                <!-- 使用栅格布局实现一行两列 -->
                <div>
                   选择网关
                   <el-select v-model="gatewayId" class="search-item" filterable clearable size="small" style="padding-left: 5px; width: 200px" placeholder="请选择设备">
                       <el-option
                           v-for="item in gatewayOptions"
                           :key="item.gatewayId"
                           :label="item.gatewayName"
                           :value="item.gatewayId">
                       </el-option>
                   </el-select>
                </div>
                <!-- 按钮容器 -->
                <div style="width: 100%; text-align: right; margin-top: 20px">
                    <el-button @click="dialogSetGateway = false" size="small">取 消</el-button>
                    <el-button type="primary" size="small" @click="handleBatchSetGateway">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 批量关联模板 -->
        <el-dialog title="请选择关联网关" :visible.sync="dialogSetTemplate" width="400px" @closed="handleClosed">
            <div style="margin-top: -10px; text-align: center">
                <!-- 使用栅格布局实现一行两列 -->
                <div>
                   选择网关
                   <el-select v-model="templateId" class="search-item" filterable clearable size="small" style="padding-left: 5px; width: 200px" placeholder="请选择设备">
                       <el-option
                           v-for="item in templateOptions"
                           :key="item.templateId"
                           :label="item.templateName"
                           :value="item.templateId">
                       </el-option>
                   </el-select>
                </div>
                <!-- 按钮容器 -->
                <div style="width: 100%; text-align: right; margin-top: 20px">
                    <el-button @click="dialogSetTemplate = false" size="small">取 消</el-button>
                    <el-button type="primary" size="small" @click="handleBatchSetTemplate">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
    `,
    data() {
        return {
            device: {
                gatewayId: '',
                templateId: '',
                deviceName: '',
                deviceAddressBit: '',
                deviceCode: '',
                deviceNumber: '',
                deviceType: '',
                deviceStatus: '',
                ctRatio: '',
                ptRatio: '',
                templateName: '',
                templateCode: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'deviceName', label: '设备名称' },
                { prop: 'deviceCode', label: '设备编码' },
                { prop: 'deviceAddressBit', label: '十进制地址位' },
                { prop: 'deviceNumber', label: '设备编号' },
            ],
            loading: true,
            multipleSelection: [],
            gatewayOptions: [],
            templateOptions: [],
            dialogSetGateway: false,
            dialogSetTemplate: false,
            gatewayId: "",
            templateId: "",
        }
    },
    created() {
        // 初始化分页列表
        this.queryPageList()
        // 获取网关下拉框
        this.getGatewayOptions()
        // 获取模板下拉框
        this.getTemplateOptions()
    },
    methods: {
        // 分页查询
        async queryPageList() {
            try {
                const response = await axios.get("/api/device/getPageList", {
                    params: { ...this.device }
                })
                this.tableData = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.device.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 获取网关列表
        async getGatewayOptions() {
            try {
                const response = await axios.get("/api/gateway/getAllList");
                this.gatewayOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 获取模板列表
        async getTemplateOptions() {
            try {
                const response = await axios.get("/api/template/getAllList");
                this.templateOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 分页条件搜索
        handleQuery() {
            this.device.pageNum = 1
            this.queryPageList();
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/device/delete', row)
                    .then(response => {
                        this.$message.success("删除成功");
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
                this.$message.warning("请至少选择一条数据");
                return;
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.post('/api/device/batchDelete', this.multipleSelection)
                    .then(response => {
                        this.$message.success("批量删除成功");
                        this.multipleSelection = []
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
            })
        },
        // 打开关联网关弹窗
        handleSetGateway(row){
            this.dialogSetGateway = true
            this.multipleSelection = []
            this.multipleSelection.push(row)
        },
        // 打开关联模板弹窗
        handleSetTemplate(row){
            this.dialogSetTemplate = true
            this.multipleSelection = []
            this.multipleSelection.push(row)
        },
        // 打开批量关联网关弹窗
        openBatchSetGateway(){
            if(this.multipleSelection.length < 1 ){
                this.$message.warning("请至少选择一条数据");
                return;
            }
            this.dialogSetGateway = true
        },
        // 打开批量关联模板弹窗
        openBatchSetTemplate(){
            if(this.multipleSelection.length < 1 ){
                this.$message.warning("请至少选择一条数据");
                return;
            }
            this.dialogSetTemplate = true
        },
        // 批量关联网关
        handleBatchSetGateway(){
            if(this.gatewayId == null || this.gatewayId === '' ){
                this.$message.warning("请选择网关");
                return;
            }
            let param = [];
            this.multipleSelection.forEach(info=>{
                let editObj = {
                    deviceId: info.deviceId,
                    gatewayId: this.gatewayId,
                }
                param.push(editObj)
            })
            // 调用修改接口
            axios.post('/api/device/batchEdit', param)
                .then(response => {
                    this.$message.success("批量关联网关成功");
                    this.dialogSetGateway = false;
                    this.multipleSelection = []
                    // 刷新列表
                    this.queryPageList();
                })
                .catch(error => {
                    this.$message.error("批量关联网关失败: " + error.message);
                }).finally(()=>{
                    this.multipleSelection = []
                    this.gatewayId = ''
                })
        },
        // 批量关联模板
        handleBatchSetTemplate(){
            if(this.templateId == null || this.templateId === '' ){
                this.$message.warning("请选择模板");
                return;
            }
            let param = [];
            this.multipleSelection.forEach(info=>{
                let editObj = {
                    deviceId: info.deviceId,
                    templateId: this.templateId,
                }
                param.push(editObj)
            })
            // 调用修改接口
            axios.post('/api/device/batchEdit', param)
                .then(response => {
                    this.$message.success("批量关联模板成功");
                    this.dialogSetTemplate= false;
                    this.multipleSelection = []
                    // 刷新列表
                    this.queryPageList();
                })
                .catch(error => {
                    this.$message.error("批量关联模板失败: " + error.message);
                }).finally(()=>{
                this.multipleSelection = []
                this.templateId = ''
            })
        },
        // 清空弹窗
        handleClosed() {
            this.gatewayId = ''
            this.templateId = ''
            this.multipleSelection = []
        },
        // 分页插件事件
        handleCurrentChange(val) {
            this.device.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.device.pageSize = val
            this.device.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 修改设备
        handleEdit(row) {
            let paramObj = {
                component: 'device-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看设备
        handleShow(row) {
            let paramObj = {
                component: 'device-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增设备
        handleCreate() {
            let paramObj = {
                component: 'device-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})
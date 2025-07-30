Vue.component('purchase-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">物料记录<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>物料记录列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">物料记录列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
          <el-button size="mini" type="primary" @click="handleCreate">添加物料记录</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="purchase.code" class="search-item" clearable size="small" placeholder="请输入文件编号"></el-input>
            <el-input v-model="purchase.brand" class="search-item" clearable size="small" placeholder="请输入品牌"></el-input>
            <el-input v-model="purchase.productName" class="search-item" clearable size="small" placeholder="请输入品名"></el-input>
            <el-input v-model="purchase.material" class="search-item" clearable size="small" placeholder="请输入材质"></el-input>
            <el-input v-model="purchase.specification" class="search-item" clearable size="small" placeholder="请输入规格"></el-input>
            <el-input v-model="purchase.materialCode" class="search-item" clearable size="small" placeholder="请输入物料编号"></el-input>
            <el-select v-model="purchase.status" class="search-item" filterable clearable size="small" placeholder="请选择解析状态">
                <el-option
                        v-for="item in statusOptions"
                        :key="item.prop"
                        :label="item.label"
                        :value="item.prop">
                </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="clickQueryButton()">查询</el-button>
        </div>
        <el-divider style="margin: 0!important;"></el-divider>
        <!-- 表格部分 -->
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <!-- 解析状态 -->
            <el-table-column
                label="解析状态"
                width="120">
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0" style="color: #a19e9e"><i class="el-icon-s-tools"></i> 未解析</span>
                    <span v-else-if="scope.row.status === 1" style="color: #13ce66"><i class="el-icon-s-tools"></i> 已解析</span>
                    <span v-else style="color: #faab0f"><i class="el-icon-s-tools"></i> 无匹配结果</span>
                </template>
            </el-table-column>
            <!-- 文件编号 -->
            <el-table-column
                label="文件编号"
                align="left"
                width="220">
                <template slot-scope="scope">
                    <span>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <!-- 序号 -->
            <el-table-column
                label="序号"
                align="left"
                width="50">
                <template slot-scope="scope">
                    <span>{{scope.row.serialNumber}}</span>
                </template>
            </el-table-column>
            <!-- 品牌 -->
            <el-table-column
                label="品牌"
                align="left"
                width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.brand}}</span>
                </template>
            </el-table-column>
            <!-- 品名 -->
            <el-table-column
                label="品名"
                align="left"
                width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.productName}}</span>
                </template>
            </el-table-column>
            <!-- 材质 -->
            <el-table-column
                label="材质"
                align="left"
                width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.material}}</span>
                </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column
                label="规格"
                align="left"
                width="300">
                <template slot-scope="scope">
                    <span>{{scope.row.specification}}</span>
                </template>
            </el-table-column>
            <!-- 物料编号 -->
            <el-table-column
                label="物料编号"
                align="left">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.description"  placement="top" :disabled="!scope.row.specification" >
                        <span style="color: #67C23A">{{ scope.row.materialCode }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column
                label="创建时间"
                align="left">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
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
            :current-page="purchase.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="purchase.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="purchase.total">
        </el-pagination>
    </div>
    `,
    data() {
        return {
            purchase: {
                id: '',
                status: '',
                code: '',
                brand: '',
                productName: '',
                material: '',
                specification: '',
                materialCode: '',
                createTime: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: '', label: '物料编号' },
                { prop: 'createTime', label: '创建时间' }
            ],
            loading: true,
            multipleSelection: [],
            statusOptions: [
                { prop: 0, label: '未解析' },
                { prop: 1, label: '已解析' },
                { prop: 2, label: '无匹配结果' },
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
                const response = await axios.get("/purchase/getPageList", {
                    params: { ...this.purchase }
                })
                console.log(response.data.data.records)
                this.tableData = response.data.data.records
                this.purchase.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 点击查询按钮
        clickQueryButton(){
            this.purchase.pageNum = 1
            this.queryPageList()
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.get('/purchase/delete', {params: {"id": row.id}})
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
            const ids = this.multipleSelection.map(item => item.id).join(',');
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.get('/purchase/batchDelete',  {params: {"ids": ids}})
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
            this.purchase.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.purchase.pageSize = val
            this.purchase.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 修改模板
        handleEdit(row) {
            let paramObj = {
                component: 'purchase-edit',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'purchase-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增模板
        handleCreate() {
            let paramObj = {
                component: 'purchase-create',
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})
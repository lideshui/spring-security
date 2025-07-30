Vue.component('analysis-list', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component">
        <div class="title"><span style="color: #a1a0a0;">解析管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>文件解析列表</div>
        <el-row class="nav" :gutter="20">
          <el-col :span="3" class="nav-title">文件解析列表</el-col>
          <el-col :offset="12" :span="9" class="nav-right">
            <el-button size="mini" type="primary" @click="handleCreate">上传解析文件</el-button>
            <el-button size="mini" @click="handleBatchDelete">批量删除</el-button>
          </el-col>
        </el-row> 
        <el-divider style="margin: 0!important;"></el-divider>
        <!--搜索框-->
        <div class="search-container">
            <el-input v-model="analysis.code" class="search-item" clearable size="small" placeholder="请输入解析编号"></el-input>
            <el-input v-model="analysis.fileName" class="search-item" clearable size="small" placeholder="请输入文件名称"></el-input>
            <el-select v-model="analysis.status" class="search-item" filterable clearable size="small" placeholder="请选择解析状态">
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
                width="100">
                align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 1" style="color: #13ce66"><i class="el-icon-s-tools"></i> 已解析</span>
                    <span v-else style="color: #a19e9e"><i class="el-icon-s-tools"></i> 未解析</span>
                </template>
            </el-table-column>
            <!-- 动态渲染 -->
            <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                show-overflow-tooltip/>
            <!-- 操作列 -->
            <el-table-column
                label="操作"
                width="220"
                align="left">
                <template slot-scope="scope">
                    <el-link class="link-container" type="primary" @click="handleShow(scope.row)">查看</el-link>
                    <el-link class="link-container" type="primary" @click="handleEdit(scope.row)">解析</el-link>
                    <el-link class="link-container" type="primary" @click="handleDownload(scope.row)">下载</el-link>
                    <el-link class="link-container" type="primary" @click="handleDelete(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <el-pagination
            class="pagination-container"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="analysis.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="analysis.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="analysis.total">
        </el-pagination>
        <!-- 上传文件弹窗 -->
        <el-dialog title="上传解析文件" :visible.sync="dialogUploadFile" width="500px" style="text-align: center">
            <el-upload
                class="upload-demo"
                drag
                action="/analysis/import"
                multiple
                :limit="1" 
                :on-exceed="handleExceed"  
                :before-upload="beforeUpload" 
                :on-success="handleSuccess"  
                :on-error="handleError"  
                :file-list="fileList">  
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10MB</div>
            </el-upload>
            <!-- 上传后的 loading 提示 -->
            <div v-show="uploading" class="upload-loading">
                <el-icon class="is-loading" type="loading" style="font-size: 32px; color: #409EFF;"></el-icon>
                <div style="margin-top: 15px; font-size: 14px; color: #409EFF;">
                    文件已上传，正在调用AI分析，可等待响应或关闭弹窗稍后刷新查看...
                </div>
            </div>
        </el-dialog>

    </div>
    `,
    data() {
        return {
            analysis: {
                id: '',
                code: '',
                fileName: '',
                status: '',
                // 分页参数
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            tableColumns: [
                { prop: 'code', label: '解析编号' },
                { prop: 'fileName', label: '文件名称' },
                { prop: 'createTime', label: '创建时间' },
                { prop: 'updateTime', label: '修改时间' }
            ],
            loading: true,
            multipleSelection: [],
            fileList: [],
            statusOptions: [
                { prop: 0, label: '未解析' },
                { prop: 1, label: '已解析' },
            ],
            dialogUploadFile: false,
            uploading: false,
            refreshInterval: null, // 存储定时器
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
                const response = await axios.get("/analysis/getPageList", {
                    params: { ...this.analysis }
                })
                this.tableData = response.data.data.records
                this.analysis.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            } finally {
                this.loading = false
            }
        },
        // 点击查询按钮
        clickQueryButton(){
            this.analysis.pageNum = 1
            this.queryPageList()
        },
        // 上传前校验
        beforeUpload(file) {
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.name.endsWith('.xlsx');
            const isLt10M = file.size / 1024 / 1024 < 10;

            if (!isXLSX) {
                this.$message.error('只能上传xlsx格式的文件！');
                return false;
            }
            if (!isLt10M) {
                this.$message.error('文件大小不能超过10MB！');
                return false;
            }
            this.uploading = true;
            return true;
        },

        // 上传成功
        handleSuccess(response, file, fileList) {
            if("文件解析完成" === response){
                this.$message.success(response);
            }else {
                this.$message.error(response);
            }
            this.dialogUploadFile = false;
            this.fileList = [];
            // 可选：刷新父组件数据
            this.$emit('upload-success');
            this.uploading = false;
            this.queryPageList();
        },

        // 上传失败
        handleError(err, file, fileList) {
            this.$message.error('上传失败：' + err.message);
            this.uploading = false;
        },

        // 超出文件限制
        handleExceed(files, fileList) {
            this.$message.warning(`最多上传1个文件，您选择了${files.length}个`);
            this.uploading = false;
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用删除接口
                axios.get('/analysis/delete', {params: {"id": row.id}})
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
                axios.get('/analysis/batchDelete',  {params: {"ids": ids}})
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
            this.analysis.pageNum = val
            this.queryPageList()
        },
        // 分页插件事件
        handleSizeChange(val) {
            this.materanalysisial.pageSize = val
            this.analysis.pageNum = 1
            this.queryPageList()
        },
        // 表格多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        // 修改
        handleEdit(row) {
            let paramObj = {
                component: 'analysis-detail',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 查看模板
        handleShow(row) {
            let paramObj = {
                component: 'analysis-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
        // 新增模板
        handleCreate() {
            this.dialogUploadFile = true;
        },
        // 下载
        handleDownload(row){
            axios.get(`/analysis/export?analysisId=${row.id}`, {
                responseType: 'blob'
            }).then(res => {
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = `${row.fileName}.xlsx`
                link.click()
            })
        },
    }
})
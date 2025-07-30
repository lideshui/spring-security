Vue.component('data-overview', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="data-overview">
        <div class="overview-title">
            依斯倍物料匹配工具
        </div>
        <el-row :gutter="0">
            <el-col :span="18">
                <div class="scrollable-area">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>运行情况</span>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="title-card">
                                <div class="chart-icon">
                                    <i class="el-icon-upload"></i>
                                </div>
                                <div class="text-content">
                                    <div>物料信息</div>
                                    <div class="number">{{dataOverview.materialTotal}}</div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="title-card">
                                <div class="chart-icon">
                                    <i class="el-icon-s-order"></i>
                                </div>
                                <div class="text-content">
                                    <div>文件解析</div>
                                    <div class="number">{{dataOverview.analysisTotal}}</div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="title-card">
                                <div class="chart-icon">
                                    <i class="el-icon-s-tools"></i>
                                </div>
                                <div class="text-content">
                                    <div>AI调用</div>
                                    <div class="number">{{dataOverview.requestTotal}}</div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="title-card">
                                <div class="chart-icon">
                                    <i class="el-icon-share"></i>
                                </div>
                                <div class="text-content">
                                    <div>AI余额</div>
                                    <div class="number">{{dataOverview.tokenTotal}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="scrollable-area">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>链路监测</span>
                    </div>
                    <el-row :gutter="20" style="padding: 0; margin: 0">
                         <div id="link-chart" style="width: 100%; height: 550px;"></div>
                    </el-row>
                </div>
            </el-col>    
            <el-col :span="6">
                <div class="scrollable-area" style="margin-left: 20px">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>采购文件成功解析率</span>
                    </div>
                    <el-progress :percentage="dataOverview.parseSuccessRate" :format="format"></el-progress>
                </div>
                <div class="scrollable-area" style="margin-left: 20px">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>AI分析引擎调用成功率</span>
                    </div>
                    <el-progress :percentage="dataOverview.pushSuccessRate" :format="format"></el-progress>
                </div>
                <div class="scrollable-area" style="margin-left: 20px">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>更新日志</span>
                    </div>
                    <div>
                        <span style="font-size: 14px; color: #8c939d">优化AI分析多线程策略</span>
                        <span style="font-size: 14px; color: #8c939d; float: right">2025-07-01 21:35:07</span>
                    </div>
                    <div style="margin-top: 5px">
                        <span style="font-size: 14px; color: #8c939d">修改了UI及文件解析相关功能</span>
                        <span style="font-size: 14px; color: #8c939d; float: right">2025-07-09 17:32:02</span>
                    </div>
                </div>
                <div class="scrollable-area" style="margin-left: 20px">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>相关文件</span>
                    </div>
                    <div style="margin-top: 5px">
                        <a href="https://data.cps88.cn/minio/cps/依斯倍物料匹配工具使用说明v1.0.1.docx" style="font-size: 14px; color: #409eff" download>
                            依斯倍物料匹配工具使用说明
                        </a>
                        <span style="font-size: 14px; color: #8c939d; float: right">2025-07-10 10:07:02</span>
                    </div>
                </div>
                <div class="scrollable-area" style="margin-left: 20px">
                    <div class="area-title">
                        <div class="area-remark"></div>
                        <span>系统运行异常日志</span>
                    </div>
                    <div style="font-size: 14px; color: #8c939d">暂无异常</div>
                </div>
            </el-col>
        </el-row> 
    </div>
    `,
    data() {
        return {
            chartData: [], // 用来存接口返回的日期+值数组
            dataOverview: {
                materialTotal: 0,
                analysisTotal: 0,
                requestTotal: 0,
                tokenTotal: 0,
                parseSuccessRate: 100,
                pushSuccessRate: 100,
            },
        }
    },
    mounted() {
        // 初始化图表
        this.$nextTick(() => {
            setTimeout(this.initChart, 300); // 延迟确保 DOM 就绪
        });
    },
    created() {
        // 初始化数据概览
        this.getDataOverview();
        // 初始化Echart数据
        this.getChartData();
    },
    methods: {
        format(percentage) {
            return `${percentage}%`;
        },
        // 分页查询
        async getDataOverview() {
            try {
                const response = await axios.get("/analysis/getDataOverview")
                this.dataOverview = {...response.data.data}
            } catch (error) {
                console.error("获取数据概览异常:", error)
                this.$message.error(`获取数据概览失败: ${error.message}`)
            }
        },
        async getChartData() {
            try {
                const res = await axios.get('/analysis/recentFull');
                this.chartData = res.data || [];
                this.initChart(); // 数据拿到后再初始化图表
            } catch (e) {
                console.error('获取图表数据失败', e);
            }
        },
        initChart() {
            const chartDom = document.getElementById('link-chart');
            if (!chartDom || !window.echarts) {
                console.error("未找到 ECharts 或 DOM 容器");
                return;
            }
            const myChart = window.echarts.init(chartDom);

            // 取日期数组
            const dates = this.chartData.map(item => item.date);
            // 取对应的值数组
            const values = this.chartData.map(item => item.value);

            const option = {
                title: {
                    text: '链路调用频率统计',
                    left: 'center',
                    top: '10px',
                    textStyle: { fontSize: 18, color: '#303133', fontWeight: 'bold' }
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50,50,50,0.8)',
                    borderColor: '#333',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    left: '3%',    // 左边距，越小图表越靠左
                    right: '3%',   // 右边距，越小图表越靠右
                    top: '10%',    // 顶部边距，适当减少留白
                    bottom: '10%', // 底部边距，适当减少留白
                    containLabel: true  // 让坐标轴标签显示不被裁剪
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLine: { lineStyle: { color: '#dcdfe6' } },
                    axisLabel: { color: '#606266', fontSize: 13 }
                },
                yAxis: {
                    type: 'value',
                    name: '调用次数',
                    nameTextStyle: {
                        color: '#909399',
                        fontSize: 13,
                        padding: [0, 0, 10, -20]
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ebeef5',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        color: '#606266',
                        fontSize: 12
                    }
                },
                series: [{
                    name: '调用次数',
                    type: 'bar',
                    barWidth: '40%',
                    data: values,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#409EFF' },
                            { offset: 1, color: '#66b1ff' }
                        ]),
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: '#605f5f',
                        fontWeight: 'bold',
                        fontSize: 12
                    }
                }]
            };

            myChart.setOption(option);
            window.addEventListener('resize', () => myChart.resize());
        },
        format(percentage) {
            return `${percentage}%`;
        },
        async getDataOverview() {
            try {
                const response = await axios.get("/analysis/getDataOverview");
                this.dataOverview = {...response.data.data};
            } catch (error) {
                console.error("获取数据概览异常:", error);
                this.$message.error(`获取数据概览失败: ${error.message}`);
            }
        }
    },
})
export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'AI驱动的智能核保系统',
    description: '利用机器学习算法自动评估再保险风险，提升核保效率80%，减少人工审核时间。支持多险种风险模型。',
    url: 'https://example.com/ai-underwriting',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['AI', '核保', '机器学习'],
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    title: 'ClaimsPro - 理赔预测分析平台',
    description: '基于历史数据的理赔趋势预测，帮助再保险公司提前识别高风险保单，优化准备金策略。',
    url: 'https://example.com/claims-analytics',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    tags: ['数据分析', '理赔', '预测'],
    createdAt: '2025-01-18',
  },
  {
    id: '3',
    title: 'NLP合同智能解析工具',
    description: '使用自然语言处理技术自动提取再保险合同关键条款，支持多语言文档处理和条款对比分析。',
    url: 'https://example.com/contract-nlp',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
    tags: ['NLP', '合同', '自动化'],
    createdAt: '2025-01-12',
  },
  {
    id: '4',
    title: '巨灾风险建模平台 CatModeler',
    description: '集成全球气象数据的巨灾风险评估系统，支持地震、台风、洪水等自然灾害的损失模拟。',
    url: 'https://example.com/cat-modeler',
    imageUrl: 'https://images.unsplash.com/photo-1527482937786-6f518d078e9c?w=600&h=400&fit=crop',
    tags: ['巨灾', '风险建模', '气象'],
    createdAt: '2025-01-10',
  },
  {
    id: '5',
    title: 'ReinsureTech API 开放平台',
    description: '面向再保险行业的标准化API接口集合，简化系统对接流程，加速数字化转型。',
    url: 'https://example.com/api-platform',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    tags: ['API', '平台', '集成'],
    createdAt: '2025-01-08',
  },
  {
    id: '6',
    title: '区块链再保险结算系统',
    description: '基于智能合约的自动化结算方案，提升再保险交易透明度，缩短结算周期从30天到实时。',
    url: 'https://example.com/blockchain-settlement',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    tags: ['区块链', '结算', '智能合约'],
    createdAt: '2025-01-05',
  },
  {
    id: '7',
    title: 'RiskViz 风险可视化仪表盘',
    description: '实时展示全球再保险组合风险敞口，支持多维度数据钻取和交互式地图展示。',
    url: 'https://example.com/risk-dashboard',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['可视化', '仪表盘', '风险'],
    createdAt: '2025-01-20',
  },
  {
    id: '8',
    title: 'LLM辅助精算报告生成',
    description: '利用大语言模型自动生成精算分析报告，支持自定义模板和多格式输出。',
    url: 'https://example.com/llm-actuary',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['LLM', '精算', '报告'],
    createdAt: '2025-01-19',
  },
  {
    id: '9',
    title: '跨境再保险合规检查工具',
    description: '自动化监管合规审查系统，覆盖全球主要再保险市场的法规要求和报告标准。',
    url: 'https://example.com/compliance-checker',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
    tags: ['合规', '监管', '跨境'],
    createdAt: '2025-01-14',
  },
  {
    id: '10',
    title: 'InsurGPT 智能问答助手',
    description: '专为再保险领域训练的AI助手，支持保单条款查询、市场数据分析和行业知识问答。',
    url: 'https://example.com/insur-gpt',
    imageUrl: 'https://images.unsplash.com/photo-1684163401408-07f7e0a5c77d?w=600&h=400&fit=crop',
    tags: ['GPT', 'AI助手', '问答'],
    createdAt: '2025-01-17',
  },
  {
    id: '11',
    title: '自动化数据交换平台 ACORD Link',
    description: '基于ACORD标准的再保险数据交换解决方案，实现与经纪人和客户的无缝数据对接。',
    url: 'https://example.com/acord-link',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
    tags: ['ACORD', '数据交换', '标准化'],
    createdAt: '2025-01-11',
  },
  {
    id: '12',
    title: '气候变化风险评估模型',
    description: '长期气候趋势对再保险业务影响的量化分析工具，支持情景模拟和压力测试。',
    url: 'https://example.com/climate-risk',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop',
    tags: ['气候', '风险评估', 'ESG'],
    createdAt: '2025-01-16',
  },
];

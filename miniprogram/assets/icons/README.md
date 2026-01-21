# TabBar 图标说明

## 📦 图标文件

当前文件夹包含 6 个 SVG 源文件：

### 黎明（醒了）
- `tab-wake-up.svg` - 未选中：半圆太阳刚升起
- `tab-wake-up-active.svg` - 选中：完整太阳升起，光芒四射

### 火焰（榜单）
- `tab-ranking.svg` - 未选中：灰色三团火焰
- `tab-ranking-active.svg` - 选中：燃烧的渐变火焰

### 嫩芽（我的）
- `tab-profile.svg` - 未选中：小嫩芽
- `tab-profile-active.svg` - 选中：生长的嫩芽，展开的叶子

---

## 🔄 转换为 PNG

小程序 TabBar 需要 PNG 格式图标，请将 SVG 转换为 PNG：

### 方法 1：使用在线工具

1. 访问 [cloudconvert.com/svg-to-png](https://cloudconvert.com/svg-to-png)
2. 上传 SVG 文件
3. 设置尺寸：**81x81** (对应 2x)，**108x108** (对应 3x)
4. 下载 PNG

### 方法 2：使用 Figma

1. 在 Figma 中新建文件
2. 拖入 SVG
3. 选中图层
4. Export → PNG → 2x / 3x

### 方法 3：使用命令行（需要安装 Inkscape）

```bash
# 安装 Inkscape
brew install inkscape  # macOS
# 或 apt-get install inkscape  # Linux

# 转换（2x）
inkscape tab-wake-up.svg --export-png=tab-wake-up.png --export-width=81 --export-height=81

# 批量转换
for file in *.svg; do
  inkscape "$file" --export-png="${file%.svg}.png" --export-width=81 --export-height=81
done
```

---

## 📐 尺寸规范

| 倍率 | 尺寸 | 用途 |
|-----|------|------|
| 1x | 40x40 | 基准（不推荐使用） |
| 2x | 81x81 | 标准屏幕（推荐） |
| 3x | 108x108 | 高清屏幕（推荐） |

**建议**：只提供 2x 和 3x 两种尺寸。

---

## 📁 最终文件结构

转换完成后，文件夹应该包含：

```
assets/icons/
├── tab-wake-up.png           (81x81)
├── tab-wake-up-active.png    (81x81)
├── tab-ranking.png           (81x81)
├── tab-ranking-active.png    (81x81)
├── tab-profile.png           (81x81)
├── tab-profile-active.png    (81x81)
├── tab-wake-up.svg           (源文件，可选保留)
├── tab-wake-up-active.svg
├── tab-ranking.svg
├── tab-ranking-active.svg
├── tab-profile.svg
└── tab-profile-active.svg
```

---

## 🎨 设计说明

### 色彩

**未选中**：`#94A3B8`（石板灰）
**选中**：
- 黎明：`#FFD700 → #FF6B35`（金色到橙色）
- 火焰：`#FFD700 → #FF6B35 → #E94560`（金色到橙红）
- 嫩芽：`#10B981 → #059669`（薄荷绿到深绿）

### 隐喻

- **黎明**：新生、希望、温暖
- **火焰**：激情、竞争、燃烧
- **嫩芽**：成长、积累、突破

---

## 🔧 注意事项

1. **保持比例**：图标应该是正方形，48x48 的画布
2. **居中对齐**：图标主体应该在画布中心
3. **留白**：四周留出至少 4px 的安全边距
4. **透明背景**：PNG 必须有透明背景
5. **文件大小**：每个 PNG 建议 < 10KB

---

## ✅ 验证

转换完成后，检查：

- [ ] 文件格式是 PNG
- [ ] 尺寸是 81x81（或 108x108）
- [ ] 背景是透明的
- [ ] 图标清晰，无锯齿
- [ ] 文件大小合理（< 10KB）

---

**设计师**: AI  
**日期**: 2026-01-20  
**灵感来源**: 大自然（太阳、火、植物）

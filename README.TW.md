# AIX-Contrastive

*閱讀其他語言版本: [English](README.md), [繁體中文](README.TW.md)*

一個介紹對比學習(Contrastive Learning)的互動式網站,專為 IEEE Xplore 沉浸式文章設計。

## 專案簡介

本專案提供了一個互動式的視覺化介面,用於展示和解釋對比學習的核心概念,包括 SimCLR 等自監督學習方法。透過互動式圖表和視覺化工具,幫助使用者理解對比學習的關鍵參數如何影響模型性能。

## 功能特色

- **互動式視覺化**: 使用 Chart.js 呈現訓練過程和結果
- **參數消融研究**: 展示不同超參數對模型性能的影響
  - Batch Size (128, 256, 512)
  - Temperature (0.1, 0.5, 1.0)
  - Epochs (100-1000)
  - Supervised vs Unsupervised learning
- **圖像增強展示**: 視覺化對比學習中的數據增強技術
- **t-SNE 視覺化**: 展示學習到的特徵表示

## 使用方式

### 本地運行

1. 複製此專案:
  ```bash
  git clone https://github.com/yourusername/AIX-Contrastive.git
  cd AIX-Contrastive
  ```

2. 使用任何網頁伺服器開啟 `index.html`

   **選項 1: 使用 Python**
   ```bash
   # Python 3
   python -m http.server 8000
   ```

   **選項 2: 使用 Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **選項 3: 使用 Live Server (VS Code 擴充套件)**
   - 在 VS Code 中安裝 Live Server 擴充套件
   - 右鍵點擊 `index.html` 選擇 "Open with Live Server"

3. 在瀏覽器中開啟 `http://localhost:8000`


**注意**: 本專案為教育用途,旨在幫助理解對比學習的基本概念和實作細節。

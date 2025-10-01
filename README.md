# AIX-Contrastive

*Read this in other languages: [English](README.md), [繁體中文](README.TW.md)*

An interactive website introducing Contrastive Learning, designed for IEEE Xplore immersive articles.

## About

This project provides an interactive visualization interface to demonstrate and explain core concepts of contrastive learning, including self-supervised learning methods like SimCLR. Through interactive charts and visualization tools, it helps users understand how key parameters affect model performance in contrastive learning.

## Features

- **Interactive Visualization**: Presenting training processes and results using Chart.js
- **Ablation Studies**: Demonstrating the impact of different hyperparameters on model performance
  - Batch Size (128, 256, 512)
  - Temperature (0.1, 0.5, 1.0)
  - Epochs (100-1000)
  - Supervised vs Unsupervised learning
- **Image Augmentation Demo**: Visualizing data augmentation techniques in contrastive learning
- **t-SNE Visualization**: Displaying learned feature representations

## Getting Started

### Local Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/AIX-Contrastive.git
cd AIX-Contrastive
```

2. Serve `index.html` using any web server

   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   ```

   **Option 2: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Option 3: Using Live Server (VS Code Extension)**
   - Install Live Server extension in VS Code
   - Right-click `index.html` and select "Open with Live Server"

3. Open `http://localhost:8000` in your browser

**Note**: This project is for educational purposes, aiming to help understand the basic concepts and implementation details of contrastive learning.

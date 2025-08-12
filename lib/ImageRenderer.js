import fs from 'fs';

/**
 * 图像渲染器
 * 将图像文件转换为贡献图坐标和强度
 */
export class ImageRenderer {
    constructor() {
        this.maxWidth = 52; // GitHub 贡献图最大宽度（周数）
        this.maxHeight = 7; // GitHub 贡献图最大高度（天数）
    }

    /**
     * 加载图像并转换为像素矩阵
     * @param {string} imagePath - 图像文件路径
     * @returns {Promise<Array<Array<number>>>} 像素矩阵
     */
    async loadImage(imagePath) {
        try {
            // 动态导入 canvas 模块
            const { createCanvas, loadImage } = await import('canvas');
            
            if (!fs.existsSync(imagePath)) {
                throw new Error(`图像文件不存在: ${imagePath}`);
            }
            
            const image = await loadImage(imagePath);
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(image, 0, 0);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            
            return this.imageDataToPixels(imageData, image.width, image.height);
        } catch (error) {
            console.error('加载图像失败:', error.message);
            throw error;
        }
    }

    /**
     * 将图像数据转换为像素矩阵
     * @param {ImageData} imageData - 图像数据
     * @param {number} width - 图像宽度
     * @param {number} height - 图像高度
     * @returns {Array<Array<number>>} 像素矩阵
     */
    imageDataToPixels(imageData, width, height) {
        const pixels = [];
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                
                // 计算亮度（使用加权平均）
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                
                // 考虑透明度
                const alpha = a / 255;
                const finalBrightness = brightness * alpha;
                
                // 将亮度转换为强度等级（0-4）
                let intensity = 0;
                if (finalBrightness > 0.8) intensity = 4;
                else if (finalBrightness > 0.6) intensity = 3;
                else if (finalBrightness > 0.4) intensity = 2;
                else if (finalBrightness > 0.2) intensity = 1;
                
                row.push(intensity);
            }
            pixels.push(row);
        }
        
        return pixels;
    }

    /**
     * 调整图像大小以适应贡献图
     * @param {Array<Array<number>>} pixels - 原始像素矩阵
     * @param {number} targetWidth - 目标宽度
     * @param {number} targetHeight - 目标高度
     * @returns {Array<Array<number>>} 调整后的像素矩阵
     */
    resizePixels(pixels, targetWidth = null, targetHeight = null) {
        if (!pixels || pixels.length === 0) return [];
        
        const originalHeight = pixels.length;
        const originalWidth = pixels[0].length;
        
        // 如果没有指定目标尺寸，计算适合的尺寸
        if (!targetWidth || !targetHeight) {
            const aspectRatio = originalWidth / originalHeight;
            
            if (aspectRatio > this.maxWidth / this.maxHeight) {
                // 宽度为限制因素
                targetWidth = Math.min(originalWidth, this.maxWidth);
                targetHeight = Math.round(targetWidth / aspectRatio);
            } else {
                // 高度为限制因素
                targetHeight = Math.min(originalHeight, this.maxHeight);
                targetWidth = Math.round(targetHeight * aspectRatio);
            }
        }
        
        const resized = [];
        
        for (let y = 0; y < targetHeight; y++) {
            const row = [];
            for (let x = 0; x < targetWidth; x++) {
                // 使用最近邻插值
                const sourceX = Math.round((x / targetWidth) * originalWidth);
                const sourceY = Math.round((y / targetHeight) * originalHeight);
                
                const clampedX = Math.min(sourceX, originalWidth - 1);
                const clampedY = Math.min(sourceY, originalHeight - 1);
                
                row.push(pixels[clampedY][clampedX]);
            }
            resized.push(row);
        }
        
        return resized;
    }

    /**
     * 将像素矩阵转换为贡献图坐标
     * @param {Array<Array<number>>} pixels - 像素矩阵
     * @param {Date} startDate - 开始日期
     * @returns {Array<{date: Date, intensity: number}>} 坐标数组
     */
    pixelsToContributions(pixels, startDate) {
        const contributions = [];
        const height = pixels.length;
        const width = pixels[0] ? pixels[0].length : 0;
        
        // 确保开始日期是周日
        const start = new Date(startDate);
        start.setDate(start.getDate() - start.getDay());
        
        for (let week = 0; week < Math.ceil(width / 7) * 7 && week < 52; week++) {
            for (let day = 0; day < 7 && day < height; day++) {
                const pixelX = week;
                const pixelY = day;
                
                if (pixelX < width && pixelY < height && pixels[pixelY] && pixels[pixelY][pixelX] > 0) {
                    const date = new Date(start);
                    date.setDate(date.getDate() + week * 7 + day);
                    
                    contributions.push({
                        date: date,
                        intensity: pixels[pixelY][pixelX]
                    });
                }
            }
        }
        
        return contributions;
    }

    /**
     * 渲染图像到贡献图
     * @param {string} imagePath - 图像文件路径
     * @param {Date} startDate - 开始日期
     * @param {number} targetWidth - 目标宽度（可选）
     * @param {number} targetHeight - 目标高度（可选）
     * @returns {Promise<Array<{date: Date, intensity: number}>>} 贡献数组
     */
    async renderImage(imagePath, startDate, targetWidth = null, targetHeight = null) {
        const pixels = await this.loadImage(imagePath);
        const resizedPixels = this.resizePixels(pixels, targetWidth, targetHeight);
        return this.pixelsToContributions(resizedPixels, startDate);
    }

    /**
     * 预览图像渲染效果
     * @param {string} imagePath - 图像文件路径
     * @param {number} targetWidth - 目标宽度（可选）
     * @param {number} targetHeight - 目标高度（可选）
     * @returns {Promise<string>} ASCII 艺术字符串
     */
    async previewImage(imagePath, targetWidth = null, targetHeight = null) {
        try {
            const pixels = await this.loadImage(imagePath);
            const resizedPixels = this.resizePixels(pixels, targetWidth, targetHeight);
            
            let result = '';
            const chars = [' ', '░', '▒', '▓', '█'];
            
            for (const row of resizedPixels) {
                for (const pixel of row) {
                    result += chars[pixel] || ' ';
                }
                result += '\n';
            }
            
            return result;
        } catch (error) {
            return `预览失败: ${error.message}`;
        }
    }

    /**
     * 从文本创建简单的位图图像
     * @param {string} text - 文本内容
     * @param {number} width - 图像宽度
     * @param {number} height - 图像高度
     * @returns {Array<Array<number>>} 像素矩阵
     */
    createTextBitmap(text, width = 52, height = 7) {
        const pixels = Array(height).fill().map(() => Array(width).fill(0));
        
        // 简单的文本渲染逻辑
        const chars = text.split('');
        const charWidth = Math.floor(width / chars.length);
        
        for (let i = 0; i < chars.length && i * charWidth < width; i++) {
            const startX = i * charWidth;
            const endX = Math.min(startX + charWidth - 1, width - 1);
            
            // 在中间行绘制字符
            const midY = Math.floor(height / 2);
            for (let x = startX; x <= endX; x++) {
                if (chars[i] !== ' ') {
                    pixels[midY][x] = 3;
                }
            }
        }
        
        return pixels;
    }
}

export default ImageRenderer;

import fs from 'fs';
import { execSync } from 'child_process';
import crypto from 'crypto';

/**
 * GitHub 贡献图伪造器
 * 通过直接操作 Git 对象来高效创建提交记录
 */
export class GitCommitForger {
    constructor(repoPath = '.') {
        this.repoPath = repoPath;
        this.initializeRepo();
    }

    /**
     * 初始化 Git 仓库
     */
    initializeRepo() {
        try {
            // 检查是否为 Git 仓库
            execSync('git rev-parse --git-dir', { 
                cwd: this.repoPath, 
                stdio: 'ignore',
                shell: '/bin/zsh'
            });
        } catch (error) {
            // 如果不是 Git 仓库，则初始化
            console.log('初始化 Git 仓库...');
            execSync('git init', { 
                cwd: this.repoPath,
                shell: '/bin/zsh'
            });
            
            // 创建初始提交
            const readmePath = `${this.repoPath}/README.md`;
            if (!fs.existsSync(readmePath)) {
                fs.writeFileSync(readmePath, '# GitHub Stats Forger\n\n这是一个用于伪造 GitHub 贡献图的仓库。');
                execSync('git add README.md', { 
                    cwd: this.repoPath,
                    shell: '/bin/zsh'
                });
                execSync('git commit -m "Initial commit"', { 
                    cwd: this.repoPath,
                    shell: '/bin/zsh'
                });
            }
        }
    }

    /**
     * 直接创建 Git 提交对象
     * 这是高效实现的核心方法
     */
    createCommitDirect(date, message = 'Update stats', intensity = 1) {
        const timestamp = Math.floor(date.getTime() / 1000);
        const authorDate = `${timestamp} +0000`;
        
        // 为了创建多个提交（控制强度），我们需要修改不同的文件
        for (let i = 0; i < intensity; i++) {
            const fileName = `data/stats_${date.toISOString().split('T')[0]}_${i}.txt`;
            const filePath = `${this.repoPath}/${fileName}`;
            
            // 确保目录存在
            const dir = `${this.repoPath}/data`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // 创建或修改文件
            const content = `Stats update ${i + 1} for ${date.toDateString()}\\nTimestamp: ${timestamp}\\nRandom: ${Math.random()}`;
            fs.writeFileSync(filePath, content);
            
            // 使用 git 命令添加和提交，但设置特定的日期
            try {
                execSync(`git add "${fileName}"`, { 
                    cwd: this.repoPath,
                    shell: '/bin/zsh'
                });
                
                const commitCommand = `GIT_AUTHOR_DATE="${authorDate}" GIT_COMMITTER_DATE="${authorDate}" git commit -m "${message} ${i + 1}"`;
                execSync(commitCommand, { 
                    cwd: this.repoPath,
                    shell: '/bin/zsh',
                    env: { 
                        ...process.env,
                        GIT_AUTHOR_DATE: authorDate,
                        GIT_COMMITTER_DATE: authorDate
                    }
                });
            } catch (error) {
                console.error(`创建提交失败: ${error.message}`);
            }
        }
    }

    /**
     * 更高效的批量提交方法
     * 使用 git fast-import 来批量创建提交
     */
    createCommitsBatch(commits) {
        const fastImportData = this.generateFastImportData(commits);
        const tempFile = `${this.repoPath}/.git/fast-import-data`;
        
        fs.writeFileSync(tempFile, fastImportData);
        
        try {
            execSync(`git fast-import < ${tempFile}`, { 
                cwd: this.repoPath,
                shell: '/bin/zsh'
            });
            fs.unlinkSync(tempFile);
        } catch (error) {
            console.error('批量提交失败:', error.message);
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
    }

    /**
     * 生成 git fast-import 格式的数据
     */
    generateFastImportData(commits) {
        let data = '';
        let markCounter = 1;
        
        for (const commit of commits) {
            const { date, message, intensity } = commit;
            const timestamp = Math.floor(date.getTime() / 1000);
            
            for (let i = 0; i < intensity; i++) {
                const fileName = `data/stats_${date.toISOString().split('T')[0]}_${i}.txt`;
                const content = `Stats update ${i + 1} for ${date.toDateString()}\\nTimestamp: ${timestamp}\\nRandom: ${Math.random()}`;
                
                // 创建 blob 对象
                data += `blob\\n`;
                data += `mark :${markCounter}\\n`;
                data += `data ${content.length}\\n`;
                data += `${content}\\n`;
                
                // 创建 commit 对象
                data += `commit refs/heads/main\\n`;
                data += `mark :${markCounter + 1}\\n`;
                data += `author GitHub Stats Forger <forger@example.com> ${timestamp} +0000\\n`;
                data += `committer GitHub Stats Forger <forger@example.com> ${timestamp} +0000\\n`;
                data += `data ${message.length}\\n`;
                data += `${message}\\n`;
                data += `M 100644 :${markCounter} ${fileName}\\n`;
                data += `\\n`;
                
                markCounter += 2;
            }
        }
        
        return data;
    }

    /**
     * 根据日期获取在贡献图中的位置
     */
    getContributionPosition(date) {
        // GitHub 贡献图从周日开始
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        
        // 找到第一个周日
        const firstSunday = new Date(startOfYear);
        firstSunday.setDate(1 - startOfYear.getDay());
        
        if (firstSunday.getFullYear() < year) {
            firstSunday.setDate(firstSunday.getDate() + 7);
        }
        
        const diffTime = date.getTime() - firstSunday.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const week = Math.floor(diffDays / 7);
        const day = diffDays % 7;
        
        return { week, day };
    }

    /**
     * 检查日期是否在有效的贡献图范围内
     */
    isValidContributionDate(date) {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        return date >= oneYearAgo && date <= now;
    }

    /**
     * 清理生成的数据文件
     */
    cleanup() {
        const dataDir = `${this.repoPath}/data`;
        if (fs.existsSync(dataDir)) {
            fs.rmSync(dataDir, { recursive: true, force: true });
        }
    }
}

export default GitCommitForger;

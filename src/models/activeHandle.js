/*
 * Author: OBKoro1
 * Date: 2020-02-05 14:49:37
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-12-25 16:08:30
 * FilePath     : \koro1FileHeader\src\models\activeHandle.js
 * Description: 扩展激活的一些监听等事情
 * https://github.com/OBKoro1
 */

const vscode = require('vscode')
const createAnnotation = require('./createAnnotation')
const fileSave = require('./fileSave')
const util = require('../utile/util')

class ActiveHandle {
  watch () {
    fileSave() // 监听文件保存
    this.createFile()
    console.log('activeHandle')
  }

  // 创建文件 自动添加注释
  createFile () {
    vscode.workspace.onDidCreateFiles((file) => {
      const config = vscode.workspace.getConfiguration('fileheader') // 配置项默认值
      if (!config.configObj.createHeader) return // 关闭
      const filePath = file.files[0].fsPath
      const openPath = vscode.Uri.file(filePath)
      vscode.workspace.openTextDocument(openPath).then((doc) => {
        vscode.window.showTextDocument(doc).then(() => {
          const editor = vscode.editor || vscode.window.activeTextEditor // 每次运行选中文件
          const fsPath = editor.document.uri.fsPath
          const hasAddProhibit = util.authList(fsPath)
          if (!hasAddProhibit) return false // 被添加进黑名单 或者没有添加进白名单
          createAnnotation.headerAnnotation(editor, {
            create: true
          })
        })
      })
    })
  }
}
module.exports = ActiveHandle

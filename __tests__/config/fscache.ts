/***************************************************
 * Created by nanyuantingfeng on 2020/7/29 11:28. *
 ***************************************************/
import os from 'os'
import path from 'path'
import fs from 'fs'

const osTempDir = os.tmpdir()

export class FSCache {
  getItem(key: string): string | null {
    const file = path.join(osTempDir, key)
    if (!fs.existsSync(file)) return null
    return String(fs.readFileSync(file))
  }

  setItem(key: string, value: string): void {
    fs.writeFileSync(path.join(osTempDir, key), value)
  }
}

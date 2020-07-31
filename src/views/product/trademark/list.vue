<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <el-table
      border
      stripe
      :data="trademarkList"
      style="width: 100%;margin:24px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width">
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width">

        <!--
          table的每一列都暗含了遍历我的trademarkList
          默认情况下，只需要给这个列指定要显示的属性值的属性
          但是如果你要修改这个数据的结构，及必须用到插槽
        -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="height: 65px;">
        </template>

      </el-table-column>
      <el-table-column
        label="操作"
        width="width">

        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="warning" icon="el-icon-edit" @click="showUpdateDialog(row)">修改</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteTrademark(row)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <el-pagination
      background
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getTrademarkList">
    </el-pagination>

    <!--添加或修改dialog-->
    <el-dialog title="添加" :visible.sync="isShowDialog">
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      isShowDialog: false,
      formLabelWidth: '100px',
      form: {
        tmName: '',
        logoUrl: ''
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page
      const response = await this.$API.trademark.getPageList(this.page, this.limit)
      if (response.code === 200) {
        this.trademarkList = response.data.records
        this.total = response.data.total
      }
    },
    // 点击添加
    showAddDialog() {
      this.isShowDialog = true
    },
    // 点击修改
    showUpdateDialog(trademark) {
      // this.form = trademark // 添加的时候弹出dialog需要清空，而修改则是那一条trademark
      this.form = { ...trademark } // 浅拷贝
      this.isShowDialog = true
    },

    // 点击添加按钮
    handleLogoSuccess(res, file) {
      this.form = {
        tmName: '',
        logoUrl: ''
      }
      this.form.logoUrl = res.data
    },

    // 上传图片需要的回调
    beforeLogoUpload(file) {
      const typeArr = ['image/jpeg', 'image/png']
      const isJpgOrPng = typeArr.indexOf(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJpgOrPng) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    async addOrUpdateTrademark() { // 添加修改二合一
      // 找参数
      const trademark = this.form

      // 发请求
      const response = await this.$API.trademark.addOrUpdate(trademark)

      // 成功
      if (response.code === 200) {
        this.$message.success(`${trademark.id ? '修改' : '添加'}品牌成功`)
        this.getTrademarkList(trademark.id && this.page)
        this.isShowDialog = false
      } else {
        // 失败
        this.$message.error(`${trademark.id ? '修改' : '添加'}品牌失败`)
      }
    },
    deleteTrademark(trademark) {
      this.$confirm(`此操作将永久删除${trademark.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确定按钮
        const response = await this.$API.trademark.delete(trademark.id)
        if (response.code === 200) {
          this.$message.success('删除成功!')
          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        } else {
          this.$message.error('删除失败!')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

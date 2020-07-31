<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="info" placeholder="SPU品牌">
          <el-option value="hh">选型</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="SPU描述" type="textarea" row="4"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="info" placeholder="还有1个未使用">
          <el-option value="hh">选型</el-option>
        </el-select>
        <template slot-scope="{row, $index}">
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        </template>
      </el-form-item>
      <el-form-item>
        <el-table border>
          <el-table-column
            align="center"
            label="序号" type="index" width="80">

          </el-table-column>
          <el-table-column label="属性名" width="150">

          </el-table-column>
          <el-table-column label="属性值名称列表">

          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "SpuForm",
    data() {
      return {
        info: '', // 测试
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style scoped>

</style>

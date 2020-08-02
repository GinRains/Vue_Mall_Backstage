<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="SPU品牌">
          <el-option v-for="trademark in trademarkList" :key="trademark.id" :label="trademark.tmName" :value="trademark.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spuInfo.description" placeholder="SPU描述" type="textarea" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccessUpload"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="unusedSaleAttrAndId" :placeholder="unusedBaseSaleAttrList.length > 0 ? `还有${unusedBaseSaleAttrList.length}属性未使用` : '没有啦'">
          <el-option v-for="unused in unusedBaseSaleAttrList" :key="unused.id" :label="unused.name" :value="`${unused.name}:${unused.id}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" size="small" :disabled="!unusedSaleAttrAndId">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table border :data="spuInfo.spuSaleAttrList">
          <el-table-column
            align="center"
            label="序号" type="index" width="80">

          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">

          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{row, $index}">
              <el-tag v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                      style="margin-right: 6px;"
                      closable
                      @close="row.spuSaleAttrValueList.splice(index, 1)"
                      :disable-transitions="false"
                      :key="spuSaleAttrValue.id">{{spuSaleAttrValue.saleAttrValueName}}</el-tag>
              <el-input v-model="row.saleAttrValueName" ref="flag" v-if="row.edit" style="width: 80px;" @blur="toggleView(row)" @keyup.13.native="toggleView(row)"></el-input>
              <el-button v-else @click="toggleEdit(row)">+ 添加新属性</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button icon="el-icon-delete" type="danger" @click="removeSaleAttr($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSpu">保存</el-button>
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
        category3Id: '',
        dialogImageUrl: '',
        dialogVisible: false,
        unusedSaleAttrAndId: '',
        spuInfo: {
          tmId: '',
          spuName: '',
          category3Id: '',
          description: '',
          spuSaleAttrList: [] // spu的销售属性
        },
        spuImageList: [],
        trademarkList: [],
        saleAttrList: []
      }
    },
    methods: {
      handleRemove(file, fileList) {
        this.spuImageList = fileList;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 图片上传成功
      handleSuccessUpload(res, file, fileList) {
        if(res.code === 200) {
          const spuImg = {
            imgName: file.name,
            name: file.name,
            url: file.response.data,
            imgUrl: file.response.data
          }
          fileList.splice(fileList.length - 1, 1, spuImg)

          this.spuImageList = fileList;
        }
      },
      // 获取数据
      async initSpuForm(spuId, category3Id) {
        this.category3Id = category3Id
        // 获取spuInfo
        const resGetSpuById = await this.$API.spu.getSpuIdInfo(spuId)
        if(resGetSpuById.code === 200) {
          this.spuInfo = resGetSpuById.data
        }
        // 获取spuImg
        const resGetSpuImg = await this.$API.spu.getIdImgList(spuId)
        if(resGetSpuImg.code === 200) {
          this.spuImageList = resGetSpuImg.data
          // 保存时要处理添加的数据
          this.spuImageList.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl
          })
        }
        // 获取trademarkList
        const resGetTrademarkList = await this.$API.trademark.getSpuTrademark()
        if(resGetTrademarkList.code === 200) {
          this.trademarkList = resGetTrademarkList.data
        }
        // 获取销售属性列表
        const resGetSaleAttrList = await this.$API.spu.getAllInfo()
        if(resGetSaleAttrList.code === 200) {
          this.saleAttrList = resGetSaleAttrList.data
        }
      },
      toggleEdit(saleAttr) {
        // 点击切换编辑模式，给当前行添加 edit 属性
        this.$set(saleAttr, "edit", true)
        // 并自动获取焦点
        this.$nextTick(() => this.$refs.flag.focus())
      },
      toggleView(saleAttr) {
        const { saleAttrValueName, baseSaleAttrId } = saleAttr
        // 判断输入值的合法性
        if(!saleAttrValueName.trim()) return void 0
        // 判断是否有重复的值
        const isRepeate = saleAttr.spuSaleAttrValueList.some(item => {
          return saleAttrValueName === item.saleAttrValueName
        })

        if(isRepeate) {
          this.$message.warning(`${saleAttrValueName} 属性值重复， 请重新输入`)
          saleAttr.saleAttrValueName = ""
          return void 0
        }
        // 合法则切换为视图模式且添加到对应的数组中
        saleAttr.spuSaleAttrValueList.push({
          saleAttrValueName,
          baseSaleAttrId
        })

        // 清空输入框，解决后面回车跟失去焦点事件连续调用
        saleAttr.saleAttrValueName = ""
        // 切换为视图模式
        saleAttr.edit = false
      },
      removeSaleAttr(index) {
        this.$confirm('此操作将永久删除该销售属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.spuInfo.spuSaleAttrList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });
        });
      },
      // 添加销售属性到spu信息中
      addSaleAttr() {
        const [ saleAttrName, baseSaleAttrId ] = this.unusedSaleAttrAndId.split(":")
        this.spuInfo.spuSaleAttrList.push({
          baseSaleAttrId,
          saleAttrName,
          spuSaleAttrValueList: []
        })
        // 清空数据
        this.unusedSaleAttrAndId = ""
      },
      // 保存spu数据
      async saveSpu() {
        // 整理数据
        const {spuInfo: submitSpuInfo, spuImageList} = this
        if(Object.keys(submitSpuInfo).indexOf('spuImageList') !== -1) delete submitSpuInfo.spuImageList
        // submitSpuInfo.spuSaleAttrList.forEach(saleAttr => saleAttr.spuSaleAttrValueList.map(value => ({saleAttrValueName: value.saleAttrValueName, baseSaleAttrId: value.baseSaleAttrId})))
        submitSpuInfo.spuSaleAttrList.forEach(saleAttr => saleAttr.spuSaleAttrValueList.map(valueObj => {
          if(valueObj.hasOwnProperty('saleAttrName')) {
            delete valueObj.saleAttrName
          }
          return valueObj
        }))
        // 整理添加的图片
        submitSpuInfo.spuImageList = spuImageList.map(spuImg => ({imgName: spuImg.imgName, imgUrl: spuImg.imgUrl}))
        // 发送请求
        const response = await this.$API.spu.addOrUpdate(submitSpuInfo)
        if(response.code === 200) {
          this.$emit("saveSuccess")
          this.$message.success("保存成功!")
          this.$emit("update:visible", false)
        }else {
          this.$message.warning("保存失败!")
        }
      },
      resetData() {
        this.category3Id = ''
        this.dialogImageUrl = ''
        this.dialogVisible = false
        this.unusedSaleAttrAndId = ''
        this.spuInfo = {
          tmId: '',
          spuName: '',
          category3Id: '',
          description: '',
          spuSaleAttrList: [] // spu的销售属性
        }
        this.spuImageList = []
        this.trademarkList = []
        this.saleAttrList = []
      }
    },
    computed: {
      unusedBaseSaleAttrList() {
        return this.saleAttrList.filter(saleAttr =>
          this.spuInfo.spuSaleAttrList.every(useSaleAttr =>
            useSaleAttr.saleAttrName !== saleAttr.name))
      }
    }
  }
</script>

<style scoped>

</style>

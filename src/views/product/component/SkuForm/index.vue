<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input type="number" placeholder="SKU价格" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(KG)">
      <el-input type="number" placeholder="SKU重量" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" placeholder="SKU规格描述" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="attrInfo.attrName" v-for="attrInfo in attrInfoList" :key="attrInfo.id">
          <el-select  v-model="attrInfo.attrIdValueId" placeholder="请选择">
            <el-option :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="spuSaleAttr.saleAttrName" v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
          <el-select v-model="spuSaleAttr.saleAttrValueId" placeholder="请选择">
            <el-option :label="spuSaleAttrValue.saleAttrValueName" :value="spuSaleAttrValue.id" v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-left: 100px;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="图片">
          <template slot-scope="{row, $index}">
            <img :src="row.imgUrl" style="height: 160px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="imgName"
          label="名称">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="{row, $index}">
            <el-button v-if="row.isDefault === '0'" type="primary" @click="setDefaultImg(row)">设为默认</el-button>
            <el-tag v-else>默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSku">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "SkuForm",
    data() {
      return {
        spu: {},
        attrInfoList: [],
        spuSaleAttrList: [],
        spuImageList: [],
        selectImageList: [],
        skuInfo: {
          category3Id: "",
          spuId: "",
          tmId: "",
          skuName: "",
          skuDesc: "",
          price: "",
          weight: "",
          skuDefaultImg: "",
          skuAttrValueList: [
            // {
            //   "attrId": "2",
            //   "valueId": "9"
            // }
          ],
          skuSaleAttrValueList: [
            // {
            //   "saleAttrValueId": 258
            // }
          ],
          skuImageList: [
            // {
            //   "imgName": "下载 (1).jpg",
            //   "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
            //   "spuImgId": 337, // 当前Spu图片的id
            //   "isDefault": "1"   // 默认为"1", 非默认为"0"
            // }
          ]
        }
      }
    },
    methods: {
      async initAddSkuForm(spu, category1Id, category2Id) {
        this.spu = spu
        const promiseO = this.$API.attr.getAttr(category1Id, category2Id, spu.category3Id)
        const promiseT = this.$API.sku.getImage(spu.id)
        const promiseTh = this.$API.spu.getSpuSaleAttrList(spu.id)
        const result = await Promise.all([promiseO, promiseT, promiseTh])

        this.attrInfoList = result[0].data
        const imgList = result[1].data
        // 在还没添加监听时，进行添加数据
        imgList.forEach(item => item.isDefault = '0')
        this.spuImageList = imgList
        this.spuSaleAttrList = result[2].data
      },
      setDefaultImg(img) {
        this.skuInfo.skuDefaultImg = img.imgUrl
        this.spuImageList.forEach(item => item.isDefault = "0")
        img.isDefault = '1'
      },
      handleSelectionChange(selection) {
        this.selectImageList = selection
      },
      async saveSku() {
        const {spu, attrInfoList, spuSaleAttrList, selectImageList, skuInfo} = this
        skuInfo.category3Id = spu.category3Id
        skuInfo.spuId = spu.id
        skuInfo.tmId = spu.tmId
        attrInfoList.forEach(attr => {
          if(attr.hasOwnProperty('attrIdValueId')) {
            const [attrId, valueId] = attr.attrIdValueId.split(":")
            skuInfo.skuAttrValueList.push({
              attrId,
              valueId
            })
          }
        })

        spuSaleAttrList.forEach(saleAttr => {
          if(saleAttr.hasOwnProperty('saleAttrValueId')) {
            skuInfo.skuSaleAttrValueList.push({
              saleAttrValueId: saleAttr.saleAttrValueId
            })
          }
        })

        selectImageList.forEach(image => {
          skuInfo.skuImageList.push({
            imgName: image.imgName,
            imgUrl: image.imgUrl,
            spuImgId: image.id,
            isDefault: image.isDefault
          })
        })

        const res = await this.$API.sku.addUpdate(skuInfo)
        if(res.code === 200) {
          this.$message.success("保存sku成功!")
          this.$emit("update:visible", false)
        }else {
          this.$message.error("保存sku失败!")
        }
      },
      resetData() {
        this.spu = {},
        this.attrInfoList = [],
        this.spuSaleAttrList = [],
        this.spuImageList = [],
        this.selectImageList = [],
        this.skuInfo = {
          category3Id: "",
          spuId: "",
          tmId: "",
          skuName: "",
          skuDesc: "",
          price: "",
          weight: "",
          skuDefaultImg: "",
          skuAttrValueList: [],
          skuSaleAttrValueList: [],
          skuImageList: []
        }
      },
      back() {
        this.$emit("update:visible", false)
        this.resetData()
      }
    }
  }
</script>

<style scoped>

</style>

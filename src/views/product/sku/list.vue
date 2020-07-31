<template>
  <div>
    <el-card>
      <CategorySelector @handleCategory="handleCategory" :isDisabled="isDisabled"></CategorySelector>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SkuList',
  data() {
    return {
      isDisabled: false
    }
  },
  methods: {
    handleCategory() {

    }
  }
}
</script>

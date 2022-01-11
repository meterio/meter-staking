<template>
  <div class="pagination-content mx-3 py-3">
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      first-text="First"
      prev-text="Previous"
      next-text="Next"
      last-text="Last"
      size="sm"
      @page-click="pageClick"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalRows: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    }
  },
  methods: {
    pageClick(bvEvent, page) {
      bvEvent.preventDefault()
      this.$emit('pageChange', page)
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagination-content {
    overflow: auto;
  }
  ::v-deep .page-item.active .page-link {
    z-index: 3;
    color: #fff;
    background-color: #003cb2;
    border-color: #003cb2;
  }
  ::v-deep .page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: 5px;
    line-height: 1.25;
    color: #003cb2;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
</style>
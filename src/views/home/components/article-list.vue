<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <article-item :article="article" v-for="(article, index) in list" :key="index" :title="article.title"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false,
      isreFreshLoading: false,
      refreshSuccessText: '刷新成功'
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  methods: {
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })

        const { results } = data.data
        this.list.unshift(...results)

        this.isreFreshLoading = false

        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (error) {
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    },
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })

        const { results } = data.data
        this.list.push(...results)

        this.loading = false

        // 判断数据什么时候加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true

        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>

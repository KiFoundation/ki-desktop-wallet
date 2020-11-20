<template>
  <div class="py-4 px-4 h-100 mx-auto" style="max-width: 1100px;">
    <b-row>
      <b-col class="pr-0" :style="{ marginRight: '10px' }" cols="1">
        <CornerLogo />
      </b-col>
      <b-col class="pl-0">
        <TopBar />
      </b-col>
    </b-row>
    <b-row :style="{ marginTop: '5px', height: 'calc(100% - 80px)' }">
      <b-col class="pr-0" cols="1" :style="{ marginRight: '10px' }">
        <SideMenu />
      </b-col>
      <b-col class="pl-0 h-100">
        <Content>
          <router-view />
        </Content>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {BRow, BCol } from 'bootstrap-vue';
import CornerLogo from './corner-logo';
import TopBar from './topbar/index';
import Content from './content';
import SideMenu from './sidemenu';

export default {
  components: {
    'b-row': BRow,
    'b-col': BCol,
    CornerLogo,
    TopBar,
    Content,
    SideMenu,
  },
};
</script>

<style scoped></style>

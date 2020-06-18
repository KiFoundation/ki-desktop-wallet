<template>
  <b-container class="py-5 h-100">
    <b-row>
      <b-col class="pr-0" :style="{ marginRight: '5px' }" cols="1">
        <CornerLogo />
      </b-col>
      <b-col class="pl-0">
        <TopBar />
      </b-col>
    </b-row>
    <b-row :style="{ marginTop: '5px', height: 'calc(100% - 80px)' }">
      <b-col class="pr-0" cols="1" :style="{ marginRight: '5px' }">
        <SideMenu />
      </b-col>
      <b-col class="pl-0 h-100">
        <Content>
          <router-view />
        </Content>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CornerLogo from './corner-logo';
import TopBar from './topbar/index';
import Content from './content';
import SideMenu from './sidemenu';

export default {
  components: {
    'b-container': BContainer,
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

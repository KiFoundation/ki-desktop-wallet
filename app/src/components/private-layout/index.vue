<template>
  <b-container fluid class="p-5">
    <b-row>
      <b-col class="pr-0 mr-lg-3" cols="1">
        <CornerLogo />
      </b-col>
      <b-col class="pl-0">
        <TopBar />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col class="pr-0 mr-lg-3" cols="1">
        <SideMenu />
      </b-col>
      <b-col class="pl-0">
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

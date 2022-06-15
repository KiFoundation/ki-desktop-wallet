<template>
<b-modal :id="modalId" hide-footer hide-header no-close-on-esc >
  <b-row align-v="center" class="text-center">
    <b-col>
      <div>
        <img src="static/img/icons/warning.png" width="100px"/>
      </div>

      <div class="basic-form modal-body d-flex w-100">
        {{$t("error_wallet_invalid")}}
      </div>

      <div class="basic-form modal-body d-flex w-100">
        {{$t("warning_wallet_invalid_delete")}}
      </div>
    </b-col>
  </b-row>
</b-modal>
</template>

<script>

export default {
  components: {
  },
  props: {
    modalId: {
      type: String,
      default: 'error-modal',
    },
  },
};
</script>

<style scoped></style>

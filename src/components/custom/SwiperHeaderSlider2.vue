<template>
    <swiper
      :pagination="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false
      }"
      :grabCursor="true"
      :effect="'creative'"
      :creativeEffect="{
        prev: {
          shadow: true,
          translate: ['-125%', 0, -800],
          rotate: [0, 0, -90],
        },
        next: {
          shadow: true,
          translate: ['125%', 0, -800],
          rotate: [0, 0, 90],
        },
      }"
      :modules="modules"
      class="mySwiper5"
    >
      <swiper-slide v-for="n in 5" :key="n">
        <img
          :src="getImage(n + 5)"
          :alt="`Slide ${n + 5}`"
          class="w-full h-full object-cover rounded-lg"
        />
      </swiper-slide>
    </swiper>
</template>
  
<script setup>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    
    // Swiper styles
    import 'swiper/css';
    import 'swiper/css/effect-creative';
    import 'swiper/css/pagination';
    
    // Swiper modules
    import { EffectCreative, Pagination, Autoplay } from 'swiper/modules';
    
    // Make modules available to the template
    const modules = [EffectCreative, Pagination, Autoplay];
    
    const getImage = (n) =>
        new URL(`/src/assets/images/slider/${n}.webp`, import.meta.url).href;
</script>
  
<style scoped>
.swiper {
    margin: auto;
    width: 100%;
    height: auto;
}
  
.swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

</style>
  
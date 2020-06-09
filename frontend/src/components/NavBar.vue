<template>
    <mdb-container class="nav navbar fixed-top">
        <logo></logo>
        <mdb-nav-item href="#" active>Home</mdb-nav-item>
        <mdb-nav-item href="#">Features</mdb-nav-item>
        <mdb-nav-item href="#">Pricing</mdb-nav-item>
    </mdb-container>
</template>

<script>
    import {mdbContainer, mdbNavItem} from 'mdbvue';
    import Logo from "@/components/Logo";

    export default {
        name: "NavBar",
        components: {
            Logo,
            mdbContainer,
            mdbNavItem,
        }
    }
</script>

<style lang="scss" scoped>
    .nav {
        position: fixed;
        //height: 100px;
        left: 0px;
        top: 0px;

        padding: 0;

        z-index: 1030;

        background: #112D4E;
    }
</style>

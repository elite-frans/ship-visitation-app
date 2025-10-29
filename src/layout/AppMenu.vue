<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    label: "Home",
    items: [
      { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
      {
        label: "Vessel Crew Info",
        icon: "pi pi-id-card",
        to: "/vessel-crew-info",
      },
    ],
  },
  {
    label: "Vessels",
    items: [
      {
        label: "List",
        icon: "pi pi-fw pi-list",
        to: "/vessels",
      },
      {
        label: "Engine",
        icon: "pi pi-fw pi-cog",
        items: [
          {
            label: "Engine Maker",
            to: "/engine/engine-maker",
          },
          {
            label: "Engine Type",
            to: "/engine/engine-type",
          },
          {
            label: "Engine D/G Maker",
            to: "/engine/engine-dg-maker",
          },
          {
            label: "Engine D/G Type",
            to: "/engine/engine-dg-type",
          },
          {
            label: "Engine T/C Maker",
            to: "/engine/engine-tc-maker",
          },
          {
            label: "Engine T/C Type",
            to: "/engine/engine-tc-type",
          },
          {
            label: "AUX Boiler Maker",
            to: "/engine/aux-boiler-maker",
          },
          {
            label: "AUX Boiler Type",
            to: "/engine/aux-boiler-type",
          },
        ],
      },
      {
        label: "Sister Ship",
        icon: "pi pi-fw pi-sitemap",
        to: "/sister-ship",
      },
      {
        label: "Related Parties",
        icon: "pi pi-fw pi-map",
        to: "/related-parties",
      },
      {
        label: "Vessel Types",
        icon: "pi pi-fw pi-tags",
        to: "/vessel-types",
      },
    ],
  },
  {
    label: "Places",
    items: [
      {
        label: "Countries",
        icon: "pi pi-fw pi-globe",
        to: "/countries",
      },
      {
        label: "Ports",
        icon: "pi pi-fw pi-map-marker",
        to: "/ports",
      },
      {
        label: "Philippines",
        icon: "pi pi-fw pi-flag-fill",
        items: [
          {
            label: "Regions",
            to: "/ph/region",
          },
          {
            label: "Provinces",
            to: "/ph/provinces",
          },
          {
            label: "Cities",
            to: "/ph/cities",
          },
          {
            label: "Barangays",
            to: "/ph/barangays",
          },
        ],
      },
    ],
  },
  {
    label: "Companies",
    items: [
      {
        label: "Ship Builders",
        icon: "pi pi-fw pi-hammer",
        to: "/ship-builders",
      },
      {
        label: "Owners",
        icon: "pi pi-fw pi-crown",
        to: "/owners",
      },
      {
        label: "ISM Companies",
        icon: "pi pi-fw pi-briefcase",
        to: "/companies",
      },
      {
        label: "Branch Offices",
        icon: "pi pi-fw pi-building",
        to: "/branch-offices",
      },
      {
        label: "Fleets",
        icon: "pi pi-fw pi-warehouse",
        to: "/fleets",
      },
      {
        label: "Mannings",
        icon: "pi pi-fw pi-users",
        to: "/mannings",
      },
    ],
  },
  {
    label: "History Logs",
    items: [
      {
        label: "History Logs",
        icon: "pi pi-fw pi-book",
        to: "/logs/all",
      },
      {
        label: "Vessel List",
        icon: "pi pi-fw pi-list",
        items: [
          {
            label: "Abbreviation",
            to: "/logs/vessel-list/abbreviation",
          },
          {
            label: "Capacity",
            to: "/logs/vessel-list/capacity",
          },
          {
            label: "Class",
            to: "/logs/vessel-list/class",
          },
          {
            label: "Class Details",
            to: "/logs/vessel-list/class_details",
          },
          {
            label: "Email",
            to: "/logs/vessel-list/email",
          },
          {
            label: "Fax",
            to: "/logs/vessel-list/fax",
          },
          {
            label: "Has Owner 1",
            to: "/logs/vessel-list/owner_1",
          },
          {
            label: "Has Owner 2",
            to: "/logs/vessel-list/owner_2",
          },
          {
            label: "Flag",
            to: "/logs/vessel-list/flag",
          },
          {
            label: "Fleet",
            to: "/logs/vessel-list/fleet",
          },
          {
            label: "ISM Company",
            to: "/logs/vessel-list/company",
          },
          {
            label: "Manager",
            to: "/logs/vessel-list/manager",
          },
          {
            label: "Registered Owner 1",
            to: "/logs/vessel-list/reg_owner_1",
          },
          {
            label: "Registered Owner 2",
            to: "/logs/vessel-list/reg_owner_2",
          },
          {
            label: "Inmarsat",
            to: "/logs/vessel-list/inmarsat",
          },
          {
            label: "Installation Char",
            to: "/logs/vessel-list/installation_char",
          },
          {
            label: "Length Moulded",
            to: "/logs/vessel-list/length_moulded",
          },
          {
            label: "Length Overall",
            to: "/logs/vessel-list/length_overall",
          },
          {
            label: "Length Registered",
            to: "/logs/vessel-list/length_registered",
          },
          {
            label: "Mobile",
            to: "/logs/vessel-list/mobile",
          },
          {
            label: "Previous Name",
            to: "/logs/vessel-list/prev_name",
          },
          {
            label: "Ship Builder",
            to: "/logs/vessel-list/ship_builder",
          },
          {
            label: "Summer Draft",
            to: "/logs/vessel-list/summer_draft",
          },
          {
            label: "Summer Freeboard",
            to: "/logs/vessel-list/summer_freeboard",
          },
          {
            label: "Tel Inmarsat FBB",
            to: "/logs/vessel-list/tel_fbb",
          },
          {
            label: "Tel VSAT Direct",
            to: "/logs/vessel-list/tel_direct",
          },
          {
            label: "Tel VSAT Ship Office",
            to: "/logs/vessel-list/tel_office",
          },
          {
            label: "Dead Weight Tonnage",
            to: "/logs/vessel-list/tonnage_dw",
          },
          {
            label: "Tonnage GI",
            to: "/logs/vessel-list/tonnage_gi",
          },
          {
            label: "Tonnage GR",
            to: "/logs/vessel-list/tonnage_gr",
          },
        ],
      },
      {
        label: "Vessel Types",
        icon: "pi pi-fw pi-tags",
        items: [
          {
            label: "Name",
            to: "/logs/vessel-type/name",
          },
          {
            label: "Code",
            to: "/logs/vessel-type/code",
          },
          {
            label: "Status",
            to: "/logs/vessel-type/status",
          },
        ],
      },
      {
        label: "Country",
        icon: "pi pi-fw pi-globe",
        items: [
          {
            label: "Name",
            to: "/logs/country/name",
          },
          // {
          //   label: "ISO Code 2",
          //   to: "/logs/country/iso_code_2",
          // },
          // {
          //   label: "ISO Code 3",
          //   to: "/logs/country/iso_code_3",
          // },
        ],
      },
      {
        label: "Port",
        icon: "pi pi-fw pi-map-marker",
        items: [
          {
            label: "Name",
            to: "/logs/port/name",
          },
          {
            label: "Country ID",
            to: "/logs/port/country_id",
          },
          // {
          //   label: "Code",
          //   to: "/logs/port/code",
          // },
          // {
          //   label: "Location Code",
          //   to: "/logs/port/locode",
          // },
        ],
      },
      {
        label: "Philippines",
        icon: "pi pi-fw pi-flag-fill",
        items: [
          {
            label: "Region",
            items: [
              {
                label: "Name",
                to: "/logs/ph/region/name",
              },
              {
                label: "Code",
                to: "/logs/ph/region/code",
              },
            ],
          },
          {
            label: "Province",
            items: [
              {
                label: "Name",
                to: "/logs/ph/province/name",
              },
              {
                label: "Region ID",
                to: "/logs/ph/province/region_id",
              },
            ],
          },
          {
            label: "City",
            items: [
              {
                label: "Name",
                to: "/logs/ph/city/name",
              },
              {
                label: "Province ID",
                to: "/logs/ph/city/province_id",
              },
            ],
          },
          {
            label: "Barangay",
            items: [
              {
                label: "Name",
                to: "/logs/ph/barangay/name",
              },
              {
                label: "City ID",
                to: "/logs/ph/barangay/city_id",
              },
            ],
          },
        ],
      },
      {
        label: "Fleet",
        icon: "pi pi-fw pi-warehouse",
        items: [
          {
            label: "Name",
            to: "/logs/fleet/name",
          },
          {
            label: "Status",
            to: "/logs/fleet/status",
          },
        ],
      },
      {
        label: "Company",
        icon: "pi pi-fw pi-building",
        items: [
          {
            label: "Name",
            to: "/logs/company/name",
          },
          {
            label: "Code",
            to: "/logs/company/code",
          },
          {
            label: "Company Type",
            to: "/logs/company/type",
          },
          {
            label: "Description",
            to: "/logs/company/description",
          },
          {
            label: "Country ID",
            to: "/logs/company/country_id",
          },
          {
            label: "Parent Company ID",
            to: "/logs/company/parent_company",
          },
          {
            label: "Manning Profile",
            items: [
              {
                label: "Alias",
                to: "/logs/company/manning/alias",
              },
              {
                label: "Alias 2",
                to: "/logs/company/manning/alias_2",
              },
              {
                label: "Character Code",
                to: "/logs/company/manning/char_code",
              },
              {
                label: "Display Color",
                to: "/logs/company/manning/color",
              },
              {
                label: "Order",
                to: "/logs/company/manning/order",
              },
            ],
          },
          {
            label: "Status",
            to: "/logs/company/status",
          },
        ],
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        label: "Auth Credentials",
        icon: "pi pi-fw pi-key",
        to: "/token-credentials",
      },
    ],
  },
  {
    label: "Hierarchy",
    items: [
      {
        label: "Submenu 1",
        icon: "pi pi-fw pi-bookmark",
        items: [
          {
            label: "Submenu 1.1",
            icon: "pi pi-fw pi-bookmark",
            items: [
              { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
              { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
              { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
            ],
          },
          {
            label: "Submenu 1.2",
            icon: "pi pi-fw pi-bookmark",
            items: [{ label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" }],
          },
        ],
      },
      {
        label: "Submenu 2",
        icon: "pi pi-fw pi-bookmark",
        items: [
          {
            label: "Submenu 2.1",
            icon: "pi pi-fw pi-bookmark",
            items: [
              { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
              { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
            ],
          },
          {
            label: "Submenu 2.2",
            icon: "pi pi-fw pi-bookmark",
            items: [{ label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" }],
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>

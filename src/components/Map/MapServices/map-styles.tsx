/* eslint-disable react/jsx-props-no-spreading */

const fileMapStyle = () => (
  `
    svg.mapboxgl-ctrl-geocoder--icon.mapboxgl-ctrl-geocoder--icon-search{
      display:none;
   }

   .mapboxgl-ctrl-geocoder, .mapboxgl-ctrl-geocoder .suggestions{
      background-color: white;
      box-shadow: none;
      max-width: none;
      width: 100%;
   }

   .mapboxgl-ctrl-geocoder--input{
      padding: 0px 5px;
      width: 100%;
      font-family: $font-primary-default;
      font-weight: 500;
      font-size: 18px;
      color: #4D5056;
   }

   .mapboxgl-ctrl-geocoder--input:focus{
    outline: none;
  }

   .mapboxgl-ctrl-geocoder--button{
     left: 98%;
   }

   .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
     display: none;
   }

   .mapboxgl-ctrl-geocoder--powered-by{
     display: none !important;
   }

   a.mapboxgl-ctrl-logo {
     display:none;
   }
   .mapboxgl-ctrl.mapboxgl-ctrl-attrib{
     display:none;
   }

    .mapboxgl-ctrl-geocoder--result-icon{
      display : none;
   }
    `
);

export default fileMapStyle;

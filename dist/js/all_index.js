class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static openDatabase(){return navigator.serviceWorker?idb.open("restaurant-db",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"})}):Promise.resolve()}static fetchRestaurants(e){DBHelper.openDatabase().then(function(e){return e?e.transaction("restaurants","readwrite").objectStore("restaurants").getAll():void 0}).then(function(t){0!==t.length&&e(null,t)}),fetch(DBHelper.DATABASE_URL).then(function(t){200===t.status?t.json().then(function(t){DBHelper.openDatabase().then(function(e){if(e){let n=e.transaction("restaurants","readwrite").objectStore("restaurants");t.forEach(function(e){n.put(e)})}}),e(null,t)}):console.log("Fetch Issue - Status Code: "+t.status)}).catch(function(e){console.log("Fetch Error: ",e)})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((r,s)=>{if(r)n(r,null);else{let r=s;"all"!=e&&(r=r.filter(t=>t.cuisine_type==e)),"all"!=t&&(r=r.filter(e=>e.neighborhood==t)),n(null,r)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}.webp`}static imageResponsiveUrlForRestaurant(e){return`/img_responsive/${e.id}-320.webp 320w,\n        /img_responsive/${e.id}-480.webp 480w,\n        /img_responsive/${e.id}-640.webp 640w,\n        /img_responsive/${e.id}-800.webp 800w`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}let restaurants,neighborhoods,cuisines;var map,markers=[];let observer=new IntersectionObserver(e=>{for(const t of e)t.intersecionRation>=.9&&DBHelper.fetchRestaurants((e,t)=>{e?console.error(e):fillRestaurantHTML(t)})},{threshold:[.9]});observer.observe(document.getElementById("restaurants-list"));const photographAlts={1:"Sereval groups of people having quality time at a restaurant.",2:"A lovely margeritta pizza",3:"An empty restaurant setting which has heaters",4:"A corner shot of the outside of the restaurat.",5:"A crowded restaurant and staff serving food from behind the bar.",6:"Restaurant with wooden tables, charis, and a US flag as a wall decoration",7:"a dog watching from the outside of a crowded burger shop, accompanied by two men.",8:"Close up of the dutch restaurant logo beside a flowering tree",9:"Black and white picture of people eating at an asian restaurat.",10:"Empty restaurant's white chairs, walls and ceilings."};document.addEventListener("DOMContentLoaded",e=>{fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{document.getElementById("map"),self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants()}),callMap=document.getElementById("mapToggle").addEventListener("click",function(e){"block"===document.getElementById("map-container").style.display?(document.getElementById("map-container").style.display="none",window.initMap()):document.getElementById("map-container").style.display="block"}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,r=t.selectedIndex,s=e[n].value,a=t[r].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(s,a,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li");t.tabIndex="0";const n=document.createElement("img");n.className="restaurant-img",n.src=DBHelper.imageUrlForRestaurant(e),n.srcset=DBHelper.imageResponsiveUrlForRestaurant(e),n.alt=photographAlts[e.id],t.append(n);const r=document.createElement("h2");r.innerHTML=e.name,t.append(r);const s=document.createElement("p");s.innerHTML=e.neighborhood,t.append(s);const a=document.createElement("p");a.innerHTML=e.address,t.append(a);const o=document.createElement("a");return o.innerHTML="View Details",o.href=DBHelper.urlForRestaurant(e),t.append(o),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})}),navigator.serviceWorker&&navigator.serviceWorker.register("sw.js").then(()=>console.log("Passed Test")),registerServiceWorker=(()=>{navigator.serviceWorker&&navigator.serviceWorker.register("/sw.js").catch(function(){console.log("Something went wrong. ServiceWorker not registered")})}),registerServiceWorker();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIiwibWFpbi5qcyIsInJlZ2lzdGVyU2VydmljZVdvcmtlci5qcyJdLCJuYW1lcyI6WyJEQkhlbHBlciIsIkRBVEFCQVNFX1VSTCIsIltvYmplY3QgT2JqZWN0XSIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJpZGIiLCJvcGVuIiwidXBncmFkZURiIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjYWxsYmFjayIsIm9wZW5EYXRhYmFzZSIsInRoZW4iLCJkYiIsInRyYW5zYWN0aW9uIiwib2JqZWN0U3RvcmUiLCJnZXRBbGwiLCJyZXN0YXVyYW50cyIsImxlbmd0aCIsImZldGNoIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJqc29uIiwic3RvcmUiLCJmb3JFYWNoIiwicmVzdGF1cmFudCIsInB1dCIsImNvbnNvbGUiLCJsb2ciLCJjYXRjaCIsImVyciIsImlkIiwiZmV0Y2hSZXN0YXVyYW50cyIsImVycm9yIiwiZmluZCIsInIiLCJjdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGgiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsIm1hcmtlcnMiLCJvYnNlcnZlciIsIkludGVyc2VjdGlvbk9ic2VydmVyIiwiY2hhbmdlcyIsImNoYW5nZSIsImludGVyc2VjaW9uUmF0aW9uIiwiZGF0YSIsImZpbGxSZXN0YXVyYW50SFRNTCIsInRocmVzaG9sZCIsIm9ic2VydmUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicGhvdG9ncmFwaEFsdHMiLCIxIiwiMiIsIjMiLCI0IiwiNSIsIjYiLCI3IiwiOCIsIjkiLCIxMCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImZldGNoTmVpZ2hib3Job29kcyIsImZldGNoQ3Vpc2luZXMiLCJzZWxmIiwiZmlsbE5laWdoYm9yaG9vZHNIVE1MIiwic2VsZWN0Iiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInZhbHVlIiwiYXBwZW5kIiwiZmlsbEN1aXNpbmVzSFRNTCIsIndpbmRvdyIsImluaXRNYXAiLCJNYXAiLCJ6b29tIiwiY2VudGVyIiwibGF0IiwibG5nIiwic2Nyb2xsd2hlZWwiLCJ1cGRhdGVSZXN0YXVyYW50cyIsImNhbGxNYXAiLCJzdHlsZSIsImRpc3BsYXkiLCJjU2VsZWN0IiwiblNlbGVjdCIsImNJbmRleCIsInNlbGVjdGVkSW5kZXgiLCJuSW5kZXgiLCJmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QiLCJyZXNldFJlc3RhdXJhbnRzIiwiZmlsbFJlc3RhdXJhbnRzSFRNTCIsIm0iLCJzZXRNYXAiLCJ1bCIsImNyZWF0ZVJlc3RhdXJhbnRIVE1MIiwiYWRkTWFya2Vyc1RvTWFwIiwibGkiLCJ0YWJJbmRleCIsImltYWdlIiwiY2xhc3NOYW1lIiwic3JjIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50Iiwic3Jjc2V0IiwiaW1hZ2VSZXNwb25zaXZlVXJsRm9yUmVzdGF1cmFudCIsImFsdCIsImFkZHJlc3MiLCJtb3JlIiwiaHJlZiIsIm1hcmtlciIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJhZGRMaXN0ZW5lciIsImxvY2F0aW9uIiwicHVzaCIsInJlZ2lzdGVyIiwicmVnaXN0ZXJTZXJ2aWNlV29ya2VyIl0sIm1hcHBpbmdzIjoiTUFHTUEsU0FNSkMsMEJBRUUsTUFBUSxvQ0FPVkMsc0JBRUUsT0FBS0MsVUFBVUMsY0FLUkMsSUFBSUMsS0FBSyxnQkFBaUIsRUFBRyxTQUFVQyxHQUNo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QixPQUFPcUMsR0FFSFYsSUFNVEQsZ0JBQWtCLEVBQUN6RyxFQUFjd0UsS0FBS3hFLGVBQ3BDQSxFQUFZTyxRQUFRQyxJQUVsQixNQUFNOEcsRUFBU3pJLFNBQVMwSSx1QkFBdUIvRyxFQUFZZ0UsS0FBSy9DLEtBQ2hFUSxPQUFPQyxLQUFLbUMsTUFBTW1ELFlBQVlGLEVBQVEsUUFBUyxLQUM3Q3JDLE9BQU93QyxTQUFTSixLQUFPQyxFQUFPOUUsTUFFaENnQyxLQUFLM0IsUUFBUTZFLEtBQUtKLE9BS2xCdEksVUFBVUMsZUFDWkQsVUFBVUMsY0FBYzBJLFNBQVMsU0FDOUJoSSxLQUFLLElBQU1lLFFBQVFDLElBQUksZ0JDek81QmlILHNCQUF3QixNQUVmNUksVUFBVUMsZUFFZkQsVUFBVUMsY0FBYzBJLFNBQVMsVUFBVS9HLE1BQU0sV0FDL0NGLFFBQVFDLElBQUksMERBSWhCaUgiLCJmaWxlIjoiYWxsX2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxyXG4gKi9cclxuY2xhc3MgREJIZWxwZXIge1xyXG5cclxuICAvKipcclxuICAgKiBEYXRhYmFzZSBVUkwuXHJcbiAgICogQ2hhbmdlIHRoaXMgdG8gcmVzdGF1cmFudHMuanNvbiBmaWxlIGxvY2F0aW9uIG9uIHlvdXIgc2VydmVyLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xyXG4gICAgY29uc3QgcG9ydCA9IDEzMzc7XHJcbiAgICByZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXN0YXVyYW50c2A7XHJcbiAgfVxyXG5cclxuXHJcbiAgIC8vIElEQiBjcmVhdGlvblxyXG5cclxuXHJcbiAgc3RhdGljIG9wZW5EYXRhYmFzZSAoKSB7XHJcblxyXG4gICAgaWYgKCFuYXZpZ2F0b3Iuc2VydmljZVdvcmtlcikge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGBTZXJ2aWNlIFdvcmtlcnMgaXMgbm90IHN1cHBvcnRlZCBieSBicm93c2Vyc2ApO1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlkYi5vcGVuKCdyZXN0YXVyYW50LWRiJywgMSwgZnVuY3Rpb24gKHVwZ3JhZGVEYikge1xyXG4gICAgICB2YXIgc3RvcmUgPSB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJywge1xyXG4gICAgICAgIGtleVBhdGg6ICdpZCcsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcclxuXHJcbiAgICAvLyBnZXQgcmVzdGF1cmFudHMgZnJvbSBpbmRleGVkREJcclxuICAgIERCSGVscGVyLm9wZW5EYXRhYmFzZSgpLnRoZW4oZnVuY3Rpb24gKGRiKSB7XHJcbiAgICAgIGlmICghZGIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJylcclxuICAgICAgICAgICAgICAgICAub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJylcclxuICAgICAgICAgICAgICAgICAuZ2V0QWxsKCk7XHJcbiAgICAgIH1cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3RhdXJhbnRzKSB7XHJcbiAgICAgIGlmIChyZXN0YXVyYW50cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZmV0Y2goREJIZWxwZXIuREFUQUJBU0VfVVJMKVxyXG4gICAgLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoIElzc3VlIC0gU3RhdHVzIENvZGU6ICcgKyByZXNwb25zZS5zdGF0dXMpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzcG9uc2UuanNvbigpLnRoZW4oZnVuY3Rpb24gKHJlc3RhdXJhbnRzKSB7XHJcblxyXG4gICAgICAgICAgLyogQWRkIHJlc3RhdXJhbnRzIHRvIGluZGV4ZWREQiAqL1xyXG4gICAgICAgICAgREJIZWxwZXIub3BlbkRhdGFiYXNlKCkudGhlbihmdW5jdGlvbiAoZGIpIHtcclxuICAgICAgICAgICAgaWYgKCFkYikge1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgc3RvcmUgPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcclxuICAgICAgICAgICAgICByZXN0YXVyYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN0YXVyYW50KSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5wdXQocmVzdGF1cmFudCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnRzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0ZldGNoIEVycm9yOiAnLCBlcnIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xyXG4gICAgLy8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT0gaWQpO1xyXG4gICAgICAgIGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgIGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSBhbmQgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcclxuICAgICAgICBpZiAoY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxyXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2RcclxuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgY29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXHJcbiAgICAgICAgY29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXHJcbiAgICAgICAgY29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS53ZWJwYCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICogUmVzdGF1cmFudCByZXNwb25zaXZlIGltYWdlcyBzb3VyY2Ugc2V0LlxyXG4gKi9cclxuc3RhdGljIGltYWdlUmVzcG9uc2l2ZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgY29uc3Qgc2NhbGUxeCA9ICczMjAnO1xyXG4gICAgY29uc3Qgc2NhbGUxXzV4ID0gJzQ4MCc7XHJcbiAgICBjb25zdCBzY2FsZTJ4ID0gJzY0MCc7XHJcbiAgICBjb25zdCBzY2FsZTN4ID0gJzgwMCc7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBgL2ltZ19yZXNwb25zaXZlLyR7cmVzdGF1cmFudC5pZH0tJHtzY2FsZTF4fS53ZWJwICR7c2NhbGUxeH13LFxyXG4gICAgICAgIC9pbWdfcmVzcG9uc2l2ZS8ke3Jlc3RhdXJhbnQuaWR9LSR7c2NhbGUxXzV4fS53ZWJwICR7c2NhbGUxXzV4fXcsXHJcbiAgICAgICAgL2ltZ19yZXNwb25zaXZlLyR7cmVzdGF1cmFudC5pZH0tJHtzY2FsZTJ4fS53ZWJwICR7c2NhbGUyeH13LFxyXG4gICAgICAgIC9pbWdfcmVzcG9uc2l2ZS8ke3Jlc3RhdXJhbnQuaWR9LSR7c2NhbGUzeH0ud2VicCAke3NjYWxlM3h9d2ApO1xyXG59XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cclxuICAgKi9cclxuICBzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXHJcbiAgICAgIHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcclxuICAgICAgbWFwOiBtYXAsXHJcbiAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBtYXJrZXI7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJsZXQgcmVzdGF1cmFudHMsXHJcbiAgbmVpZ2hib3Job29kcyxcclxuICBjdWlzaW5lc1xyXG52YXIgbWFwXHJcbnZhciBtYXJrZXJzID0gW11cclxuXHJcbmxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihjaGFuZ2VzID0+IHtcclxuICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlLmludGVyc2VjaW9uUmF0aW9uID49IDAuOSkge1xyXG4gICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGxSZXN0YXVyYW50SFRNTChkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59LFxyXG4gIHtcclxuICAgIHRocmVzaG9sZDogWzAuOV1cclxuICB9XHJcbik7XHJcblxyXG5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0JykpO1xyXG5cclxuLypcclxuU2V0dGluZyBwaG90b2dyYXBocyBhbHRzKi9cclxuXHJcbmNvbnN0IHBob3RvZ3JhcGhBbHRzID0ge1xyXG5cdDE6IFwiU2VyZXZhbCBncm91cHMgb2YgcGVvcGxlIGhhdmluZyBxdWFsaXR5IHRpbWUgYXQgYSByZXN0YXVyYW50LlwiLFxyXG5cdDI6IFwiQSBsb3ZlbHkgbWFyZ2VyaXR0YSBwaXp6YVwiLFxyXG5cdDM6IFwiQW4gZW1wdHkgcmVzdGF1cmFudCBzZXR0aW5nIHdoaWNoIGhhcyBoZWF0ZXJzXCIsXHJcblx0NDogXCJBIGNvcm5lciBzaG90IG9mIHRoZSBvdXRzaWRlIG9mIHRoZSByZXN0YXVyYXQuXCIsXHJcblx0NTogXCJBIGNyb3dkZWQgcmVzdGF1cmFudCBhbmQgc3RhZmYgc2VydmluZyBmb29kIGZyb20gYmVoaW5kIHRoZSBiYXIuXCIsXHJcblx0NjogXCJSZXN0YXVyYW50IHdpdGggd29vZGVuIHRhYmxlcywgY2hhcmlzLCBhbmQgYSBVUyBmbGFnIGFzIGEgd2FsbCBkZWNvcmF0aW9uXCIsXHJcblx0NzogXCJhIGRvZyB3YXRjaGluZyBmcm9tIHRoZSBvdXRzaWRlIG9mIGEgY3Jvd2RlZCBidXJnZXIgc2hvcCwgYWNjb21wYW5pZWQgYnkgdHdvIG1lbi5cIixcclxuXHQ4OiBcIkNsb3NlIHVwIG9mIHRoZSBkdXRjaCByZXN0YXVyYW50IGxvZ28gYmVzaWRlIGEgZmxvd2VyaW5nIHRyZWVcIixcclxuXHQ5OiBcIkJsYWNrIGFuZCB3aGl0ZSBwaWN0dXJlIG9mIHBlb3BsZSBlYXRpbmcgYXQgYW4gYXNpYW4gcmVzdGF1cmF0LlwiLFxyXG5cdDEwOiBcIkVtcHR5IHJlc3RhdXJhbnQncyB3aGl0ZSBjaGFpcnMsIHdhbGxzIGFuZCBjZWlsaW5ncy5cIlxyXG59O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogRmV0Y2ggbmVpZ2hib3Job29kcyBhbmQgY3Vpc2luZXMgYXMgc29vbiBhcyB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcbiAqL1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XHJcbiAgZmV0Y2hOZWlnaGJvcmhvb2RzKCk7XHJcbiAgZmV0Y2hDdWlzaW5lcygpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyBhbmQgc2V0IHRoZWlyIEhUTUwuXHJcbiAqL1xyXG5mZXRjaE5laWdoYm9yaG9vZHMgPSAoKSA9PiB7XHJcbiAgREJIZWxwZXIuZmV0Y2hOZWlnaGJvcmhvb2RzKChlcnJvciwgbmVpZ2hib3Job29kcykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvclxyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGYubmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHM7XHJcbiAgICAgIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IG5laWdoYm9yaG9vZHMgSFRNTC5cclxuICovXHJcbmZpbGxOZWlnaGJvcmhvb2RzSFRNTCA9IChuZWlnaGJvcmhvb2RzID0gc2VsZi5uZWlnaGJvcmhvb2RzKSA9PiB7XHJcbiAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25laWdoYm9yaG9vZHMtc2VsZWN0Jyk7XHJcbiAgbmVpZ2hib3Job29kcy5mb3JFYWNoKG5laWdoYm9yaG9vZCA9PiB7XHJcbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgIG9wdGlvbi5pbm5lckhUTUwgPSBuZWlnaGJvcmhvb2Q7XHJcbiAgICBvcHRpb24udmFsdWUgPSBuZWlnaGJvcmhvb2Q7XHJcbiAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgY3Vpc2luZXMgYW5kIHNldCB0aGVpciBIVE1MLlxyXG4gKi9cclxuZmV0Y2hDdWlzaW5lcyA9ICgpID0+IHtcclxuICBEQkhlbHBlci5mZXRjaEN1aXNpbmVzKChlcnJvciwgY3Vpc2luZXMpID0+IHtcclxuICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5jdWlzaW5lcyA9IGN1aXNpbmVzO1xyXG4gICAgICBmaWxsQ3Vpc2luZXNIVE1MKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgY3Vpc2luZXMgSFRNTC5cclxuICovXHJcbmZpbGxDdWlzaW5lc0hUTUwgPSAoY3Vpc2luZXMgPSBzZWxmLmN1aXNpbmVzKSA9PiB7XHJcbiAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xyXG5cclxuICBjdWlzaW5lcy5mb3JFYWNoKGN1aXNpbmUgPT4ge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHRpb24uaW5uZXJIVE1MID0gY3Vpc2luZTtcclxuICAgIG9wdGlvbi52YWx1ZSA9IGN1aXNpbmU7XHJcbiAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXHJcbiAqL1xyXG4gd2luZG93LmluaXRNYXAgPSAoKSA9PiB7XHJcbiAgbGV0IGxvYyA9IHtcclxuICAgIGxhdDogNDAuNzIyMjE2LFxyXG4gICAgbG5nOiAtNzMuOTg3NTAxXHJcbiAgfTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XHJcbiAgc2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xyXG4gICAgem9vbTogMTIsXHJcbiAgICBjZW50ZXI6IGxvYyxcclxuICAgIHNjcm9sbHdoZWVsOiBmYWxzZVxyXG4gIH0pO1xyXG5cclxuICB1cGRhdGVSZXN0YXVyYW50cygpO1xyXG59XHJcblxyXG4vKipcclxuU2hvdyBtYXAgYnV0dG9uXHJcbiovXHJcbmNhbGxNYXAgPVxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwVG9nZ2xlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5KSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgd2luZG93LmluaXRNYXAoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICB9XHJcbn0pO1xyXG4vKipcclxuICogVXBkYXRlIHBhZ2UgYW5kIG1hcCBmb3IgY3VycmVudCByZXN0YXVyYW50cy5cclxuICovXHJcbnVwZGF0ZVJlc3RhdXJhbnRzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XHJcbiAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG5cclxuICBjb25zdCBjSW5kZXggPSBjU2VsZWN0LnNlbGVjdGVkSW5kZXg7XHJcbiAgY29uc3QgbkluZGV4ID0gblNlbGVjdC5zZWxlY3RlZEluZGV4O1xyXG5cclxuICBjb25zdCBjdWlzaW5lID0gY1NlbGVjdFtjSW5kZXhdLnZhbHVlO1xyXG4gIGNvbnN0IG5laWdoYm9yaG9vZCA9IG5TZWxlY3RbbkluZGV4XS52YWx1ZTtcclxuXHJcbiAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNldFJlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKTtcclxuICAgICAgZmlsbFJlc3RhdXJhbnRzSFRNTCgpO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhciBjdXJyZW50IHJlc3RhdXJhbnRzLCB0aGVpciBIVE1MIGFuZCByZW1vdmUgdGhlaXIgbWFwIG1hcmtlcnMuXHJcbiAqL1xyXG5yZXNldFJlc3RhdXJhbnRzID0gKHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgLy8gUmVtb3ZlIGFsbCByZXN0YXVyYW50c1xyXG4gIHNlbGYucmVzdGF1cmFudHMgPSBbXTtcclxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgdWwuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gIC8vIFJlbW92ZSBhbGwgbWFwIG1hcmtlcnNcclxuICBzZWxmLm1hcmtlcnMuZm9yRWFjaChtID0+IG0uc2V0TWFwKG51bGwpKTtcclxuICBzZWxmLm1hcmtlcnMgPSBbXTtcclxuICBzZWxmLnJlc3RhdXJhbnRzID0gcmVzdGF1cmFudHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYWxsIHJlc3RhdXJhbnRzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxyXG4gKi9cclxuZmlsbFJlc3RhdXJhbnRzSFRNTCA9IChyZXN0YXVyYW50cyA9IHNlbGYucmVzdGF1cmFudHMpID0+IHtcclxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgcmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcclxuICAgIHVsLmFwcGVuZChjcmVhdGVSZXN0YXVyYW50SFRNTChyZXN0YXVyYW50KSk7XHJcbiAgfSk7XHJcbiAgYWRkTWFya2Vyc1RvTWFwKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MLlxyXG4gKi9cclxuY3JlYXRlUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCkgPT4ge1xyXG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICBsaS50YWJJbmRleCA9JzAnO1xyXG5cclxuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XHJcbiAgaW1hZ2Uuc3JjID0gREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xyXG4gIGltYWdlLnNyY3NldCA9IERCSGVscGVyLmltYWdlUmVzcG9uc2l2ZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XHJcbiAgaW1hZ2UuYWx0ID0gcGhvdG9ncmFwaEFsdHNbcmVzdGF1cmFudC5pZF07XHJcbiAgbGkuYXBwZW5kKGltYWdlKTtcclxuXHJcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XHJcbiAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XHJcbiAgbGkuYXBwZW5kKG5hbWUpO1xyXG5cclxuICBjb25zdCBuZWlnaGJvcmhvb2QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgbmVpZ2hib3Job29kLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmVpZ2hib3Job29kO1xyXG4gIGxpLmFwcGVuZChuZWlnaGJvcmhvb2QpO1xyXG5cclxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xyXG4gIGxpLmFwcGVuZChhZGRyZXNzKTtcclxuXHJcbiAgY29uc3QgbW9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICBtb3JlLmlubmVySFRNTCA9ICdWaWV3IERldGFpbHMnO1xyXG4gIG1vcmUuaHJlZiA9IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XHJcbiAgbGkuYXBwZW5kKG1vcmUpXHJcblxyXG4gIHJldHVybiBsaVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIG1hcmtlcnMgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMgdG8gdGhlIG1hcC5cclxuICovXHJcbmFkZE1hcmtlcnNUb01hcCA9IChyZXN0YXVyYW50cyA9IHNlbGYucmVzdGF1cmFudHMpID0+IHtcclxuICByZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xyXG4gICAgLy8gQWRkIG1hcmtlciB0byB0aGUgbWFwXHJcbiAgICBjb25zdCBtYXJrZXIgPSBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIHNlbGYubWFwKTtcclxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG1hcmtlci51cmxcclxuICAgIH0pO1xyXG4gICAgc2VsZi5tYXJrZXJzLnB1c2gobWFya2VyKTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlcikge1xyXG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCdzdy5qcycpXHJcbiAgICAudGhlbigoKSA9PiBjb25zb2xlLmxvZygnUGFzc2VkIFRlc3QnKSlcclxufTtcclxuIiwiXHJcbi8qKlxyXG4gKiBSZWdpc3RlciBhIHNlcnZpY2VXb3JrZXJcclxuICovXHJcbnJlZ2lzdGVyU2VydmljZVdvcmtlciA9ICgpID0+IHtcclxuICAgIC8vY2hlY2sgaWYgc2VydmljZVdvcmtlciBpcyBzdXBwb3J0ZWQsIG90aGVyd2lzZSByZXR1cm5cclxuICAgIGlmICghbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIpIHJldHVybjtcclxuXHJcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3N3LmpzJykuY2F0Y2goZnVuY3Rpb24oKXtcclxuICAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gU2VydmljZVdvcmtlciBub3QgcmVnaXN0ZXJlZFwiKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJlZ2lzdGVyU2VydmljZVdvcmtlcigpO1xyXG4iXX0=

/**
 * Created by jibin on 2018/3/28.
 */

/**
 * '/userinfo/2144/id' => ['/userinfo', '/userinfo/2144', '/userinfo/2144/id']
 * @param url
 */
export function urlToList(url){
  const urlList = url.split('/').filter(i => i);
  return urlList.map((urlItem, index) => {
    return `/${urlList.slice(0, index+1).join('/')}`;
  });
}

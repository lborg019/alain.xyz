/**
 POST /v1/users um.com
Authorization: Bearer 181d415f34379af07b2c11d144dfbe35d
Content-Type: application/json
Accept: application/json
Accept-Charset: utf-8

On git push
On Blog Build
If that blog post is due to be published (datePublished < new Date()), 
and the key social: { medium doesn't exist}
POST to api.medium.com/v1/users/alaingalvan/posts
with auth header
the following json data
{
  title,
  content,
  contentFormat: 'markdown',
  canonicalUrl: `https://alain.xyz/${permalink}`,
  keywords,
  publishStatus: 'public'
}
*/
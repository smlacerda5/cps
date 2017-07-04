# The Coalition for Public Safety


Built with keystone.js utilizing the following modules:


-jade view engine

-connect-mongo for session storage

-mailchimp for newsletter signup

-mongo database

-cloudinary for image cdn services

-jquery for front-end DOM manipulation/event handling

-ajax for pagination/categories/filters

-bootstrap grid layout and sliders


## FRONT-END 


Key features:

# Image URL's 

In the jade templates, you may notice img tags like:



img(srcset='#{post.small_url} 500w, #{post.medium_url} 900w, #{post.large_url} 1200w, #{post.x_large_url} 2000w' src='#{post.medium_url}' alt=post.title)


The src is actually a virtual field specified in the model. This allows me to access the proper size image. So, instead of serving single image sizes which hog bandwith, we setup several possible image sizes from small_url to x_large_url.


In the header, the image is actually a background, so since srcset is not available for background images, we are using an img tag with a workaround. 


We initially hide the image using .hidden. Then we grab the image with a class of 'img-srcset', get its currentSrc, which contains the url srcset actually used for the correct image size. Then replace the background image (.img-replace) with the src from the images currentSrc property.




2) Currently, we're using several mixins and includes to handle duplicity in code. All the mixins are located in templates/mixins, and includes are in templates/includes.




3) Equal height blocks - We wanted all the posts to have the same height, but since the posts title may be different lengths, we incorporated an equal-height script that obtains all the .block-row > .equal-height classes. We find the block with the largest height, then set all the other blocks to that height. We also set it to trigger on resize events.


Example: /stories - each box with a greyish background is the same height, and will always be the same height regardless of content length.




4) Navbar - The navbar is adjusted at many different widths to increase margins and decrease margins in order to gain the most useful area of the nav. We then display a hamburger when the text is squeezed.




5) Ajax on filters/pagination - Instead of having the entire page reload, we decided to use ajax queries to only retrieve the data that has changed since the last query. 


For instance, /press has a 'Filter by' select button. Using ajax the page does not fully reload, only the content that has changed is reloaded. This is also true for pagination.


For pagination, we used a req.query.next parameter to tell us whether the pagination was for the next page:


	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-story.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('stories');
	}


We did something similar with the categories and filter sections, which are located in routes/api.




6) Nav scroll - A scroll event is used to identify when the navbar has reached the top of the page, thus, locking the navbar to a static position at the top of the page. We setup a timeout delay to limit the number of scroll events to check, otherwise, the scroll event is run repeatedly  and it causes memory issues as the events queue up.




7) Language support - We are using jade variables in order to perform language translations, which is faster than i18n json variable translation. 


What we do is load a different jade variable file (variables-page-en.jade or variables-page-es.jade) based on the res.locals.filters.locale expression from our view function. This in turn handles all the static information on the site. 


From our view function, we only load posts that are in the locale specified, thus, an english post will not show up when the user is in locale 'es'. 




8) d3 map - using d3 we created a United States map that scales. A user can click on a state and have bullet points displayed identifying several key points. The bullets are configurable from with the admin user interface.




9) less - We automated minification of our .less files into site.min.css using grunt as our task automation module.




10) Twitter feed - an ajax request is made to the cps server, which calls on a twit module to make a request to twitter with the proper credentials. The response is sent back to the client ajax caller, which compiles the information and appends it to the page.



# BACK-END 


Key features:


1) Language support - the locale is set when the user clicks on ENG / ESP on posts pages. This in turn sends an ajax query to the server, which sets req.session.locale to 'en' or 'es'. The page is then reloaded with the new information from the language specified. Since, the locale is now stored for the session the view functions can now serve up the correct data based on the users locale setting.




2) Cloudinary support - We are using a .fill setting in (models/plugins) to maintain the aspect-ratio for our images, which helps with image optimization and resolution.




3) Cloudinary image sizes - We created a plugin (/models/plugins) to handle image sizes. The plugin allows us to use virtual fields in our jade templates, which calls the correct size image based on the srcset property.




4) Relationships - in order to avoid duplication in our models, we use several relationship fields. Allowing us to have a single model/list, that can be reused throughout the site.




5) Track option - setting the track option to true, auto-updates each model entry whenever a user adds or updates an entry.




6) Wysiwyg support - wysiwyg uses a tinyMCE editor which allows the admin user to enter posts with html formatting. Admin can input images, text, links, etc... into the wysiwyg area and have it display in the proper formatting on the single posts page.




7) Session stores - all sessions are stored in a mongo model (app_sessions), which initializes on query in req.session.
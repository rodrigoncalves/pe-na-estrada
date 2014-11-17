# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( google_maps_api.js )

# Precompile qunit files
Rails.application.config.assets.precompile += %w( qunit.css )
Rails.application.config.assets.precompile += %w( test_helper.css )
Rails.application.config.assets.precompile += %w( qunit.js )
Rails.application.config.assets.precompile += %w( test_helper.js )

#Precompile teaspoon files
Rails.application.config.assets.precompile += %w( teaspoon.css )
Rails.application.config.assets.precompile += %w( teaspoon-teaspoon.js )

# Precompile teaspoon-qunit files
Rails.application.config.assets.precompile += %w( qunit/1.14.0.js )
Rails.application.config.assets.precompile += %w( teaspoon-qunit.js )

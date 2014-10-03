class HighwaysController < ApplicationController

	def index

		@highways = Highway.all  #for parser

						@search_highway_form_result = params[:highway_search]

						@param_exists = check_highway_exists (@search_highway_form_result)

		if @search_highway_form_result
				@highway = Highway.search_for_highway(check_highway_number(@search_highway_form_result))
		else
				@highway = nil
		end

	end

	# Count the number of highways registered on DB
		def count_number_of_highways
			
			@highways = Highway.all
			number_of_highways = 0

			@highways.each do |h|
				number_of_highways = number_of_highways + 1
			end	

			return number_of_highways

		end

			def check_highway_exists (highway_to_check)

						if Highway.exists?(['idBr LIKE ?', "%#{highway_to_check}%"])
								return true
						else
								return false
						end

			end

		# Check if the user typed a '0' on highway number first character
		def check_highway_number (highway_number)

			if highway_number.at(0) == "0"

				highway_number = highway_number.from(1)

			else
				# Nothing to do
			end

			return highway_number

		end

	def new
		
	end

	# Method used for parser
	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados rodovias importados com sucesso!"
	end


	def show
		@accident = Accident.group(:br).count
		@highway = Highway.all.order(:accidentsRate).reverse_order
		@highways = Highway.all
			
		br_accident = nil
		count_accident = nil
		mileage_br = nil
		@accident.each do |br, count|
			br_accident = br
			count_accident = count.to_s
			@highways.each do |h|
				mileage_br = h.mileage.to_s
				if h.idBr == br_accident
					if mileage_br.blank?
						h.accidentsRate = 0.0
						h.save
					else
						h.accidentsRate = count_accident.to_f/mileage_br.to_f
						h.save
					end
				end
			end
		end
	end
end
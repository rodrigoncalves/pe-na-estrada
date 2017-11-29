class AccidentNode
  include Neo4j::ActiveNode

  property :latitude
  property :longitude
  property :uf
  property :km

  has_one :out, :highway, type: :highway, model_class: :HighwayNode
end


class HighwayNode
  include Neo4j::ActiveNode

  property :br
  property :mileage

  has_many :in, :accidents, origin: :highway, model_class: :AccidentNode
end

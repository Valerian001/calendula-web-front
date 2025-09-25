import { useState } from "react";
import {
  X,
  Check,
  AlertCircle,
  Users,
  MessageCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";

type BargainModalProps = {
  product: {
    name: string;
    currentPrice: number;
    lowestPrice: number;
    vendor: { name: string };
  };
  showBargainModal: boolean;
  setShowBargainModal: (val: boolean) => void;
  quantity: number;
};

export default function BargainModal({
  product,
  showBargainModal,
  setShowBargainModal,
  quantity,
}: BargainModalProps) {
  const router = useRouter()
  const [bargainStage, setBargainStage] = useState("initial");
  const [proposedPrice, setProposedPrice] = useState("");
  const [negotiationHistory, setNegotiationHistory] = useState<
    { type: string; price?: number; message?: string; timestamp: Date }[]
  >([]);
  const [currentVendorPrice, setCurrentVendorPrice] = useState(
    product.currentPrice
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        negotiatedPrice: currentVendorPrice,
        quantity,
      })
    );
    setShowBargainModal(false);
  };

  // --- Core Logic ---
  const handlePriceProposal = () => {
    if (!proposedPrice) return;
    const proposed = parseFloat(proposedPrice);

    const newNegotiation = {
      type: "customer_offer",
      price: proposed,
      timestamp: new Date(),
    };
    setNegotiationHistory((prev) => [...prev, newNegotiation]);

    const acceptableCounter = product.lowestPrice * 1.1;
    const isFirstProposal = negotiationHistory.length === 0;

    const lastVendorCounter = negotiationHistory
      .slice()
      .reverse()
      .find((entry) => entry.type === "vendor_counter");

    const hasCounteredOnce = !!lastVendorCounter;
    const isAcceptingCounter =
      lastVendorCounter && proposed === lastVendorCounter.price;

    setTimeout(() => {
      if (proposed < product.lowestPrice) {
        // --- DENY if below lowest price ---
        setNegotiationHistory((prev) => [
          ...prev,
          {
            type: "vendor_deny",
            message:
              "This price is too low. Please make a reasonable offer.",
            timestamp: new Date(),
          },
        ]);
        setBargainStage("denied");
      } else if (
        isAcceptingCounter ||
        (!isFirstProposal && proposed >= acceptableCounter && hasCounteredOnce)
      ) {
        // --- ACCEPT if accepting counter or offering acceptable price ---
        setNegotiationHistory((prev) => [
          ...prev,
          {
            type: "vendor_accept",
            price: proposed,
            timestamp: new Date(),
          },
        ]);
        setCurrentVendorPrice(proposed);
        setBargainStage("accepted");
      } else if (
        !hasCounteredOnce &&
        proposed >= product.lowestPrice &&
        proposed < acceptableCounter
      ) {
        // --- COUNTER once ---
        const counterOffer = Math.min(acceptableCounter, currentVendorPrice - 2);
        setNegotiationHistory((prev) => [
          ...prev,
          {
            type: "vendor_counter",
            price: counterOffer,
            timestamp: new Date(),
          },
        ]);
        setCurrentVendorPrice(counterOffer);
      } else if (hasCounteredOnce && proposed >= product.lowestPrice) {
        // --- ACCEPT any ≥ lowestPrice after counter ---
        setNegotiationHistory((prev) => [
          ...prev,
          {
            type: "vendor_accept",
            price: proposed,
            timestamp: new Date(),
          },
        ]);
        setCurrentVendorPrice(proposed);
        setBargainStage("accepted");
      } else {
        // --- DENY fallback ---
        setNegotiationHistory((prev) => [
          ...prev,
          {
            type: "vendor_deny",
            message:
              "This price is too low. Please make a reasonable offer.",
            timestamp: new Date(),
          },
        ]);
        setBargainStage("denied");
      }
    }, 1500);

    setProposedPrice("");
  };

  const dispatch = useDispatch();

  

  if (!showBargainModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg mx-4 border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Bargain with Vendor
            <MessageCircle className="w-6 h-6 text-yellow-400" />
          </h2>
          <button
            onClick={() => setShowBargainModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Negotiation History */}
        <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
          {negotiationHistory.length === 0 && (
            <p className="text-gray-400 text-center">
              Start bargaining with the vendor
            </p>
          )}

          {negotiationHistory.map((entry, i) => (
            <div
              key={i}
              className={`flex ${
                entry.type === "customer_offer"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  entry.type === "customer_offer"
                    ? "bg-yellow-400 text-black"
                    : entry.type.includes("accept")
                    ? "bg-green-600 text-white"
                    : entry.type.includes("deny")
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {entry.price && (
                  <p className="font-bold">₦{entry.price.toFixed(2)}</p>
                )}
                {entry.message && <p>{entry.message}</p>}
                <span className="text-xs opacity-70 block mt-1">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700/50">
          {bargainStage !== "accepted" ? (
            <div className="flex gap-3">
              <input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                placeholder="Enter your offer price"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button
                onClick={handlePriceProposal}
                className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Propose
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>Offer Accepted</span>
              </div>
              <button 
                onClick={()=>{
                  handleAddToCart()
                  router.push('/cart')
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors duration-300"
              >
                Proceed to Cart+
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-800/40 rounded-b-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span>Lowest accepted price: ₦{product.lowestPrice}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Vendor: {product.vendor.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import Button from "./Button";
import "../styles/layout.css";

export default function VehicleTable({ vehicles, onEdit, onDelete }) {
    if (!vehicles || vehicles.length === 0) {
        return <div className="muted">No vehicles found.</div>;
    }

    return (
        <div className="table">
            <div className="table__row table__head">
                <div>Vehicle No</div>
                <div>Make</div>
                <div>Model</div>
                <div>Year</div>
                <div className="table__actions">Actions</div>
            </div>

            {vehicles.map((v) => (
                <div key={v.id} className="table__row">
                    <div>{v.vehicleNumber}</div>
                    <div>{v.make}</div>
                    <div>{v.model}</div>
                    <div>{v.year}</div>
                    <div className="table__actions">
                        <Button variant="ghost" onClick={() => onEdit(v)}>Edit</Button>
                        <Button variant="danger" onClick={() => onDelete(v)}>Delete</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
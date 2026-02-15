import { Spin } from "antd";
import OrdersFilters from "./components/OrdersFilters ";
import OrdersHeader from "./components/OrdersHeader";
import OrdersTable from "./components/OrdersTable";
import { useOrders } from "../../hooks/useOrders";

const Orders = () => {
    const {
        orders,
        loading,
        total,
        page,
        limit,
        paymentStatus,
        orderStatus,
        searchQuery,
        handleSearch,
        handlePaymentFilter,
        handleStatusFilter,
        handlePagination,
        handlePageSize
    } = useOrders();

    return (
        <div>
            <OrdersHeader />
            <OrdersFilters
                paymentStatus={paymentStatus}
                orderStatus={orderStatus}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onPaymentFilter={handlePaymentFilter}
                onStatusFilter={handleStatusFilter}
            />
            {(orders && orders.length) ?
                <OrdersTable
                    orders={orders}
                    loading={loading}
                    total={total}
                    page={page}
                    limit={limit}
                    onPagination={handlePagination}
                    onPageSize={handlePageSize}
                />
                :
                <Spin
                    tip="Loading orders..."
                    size="large"
                    style={{ margin: '100px auto', display: 'block' }}
                />
            }
        </div>
    );
};

export default Orders;
